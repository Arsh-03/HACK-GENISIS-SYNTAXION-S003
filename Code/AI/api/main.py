from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import json
import os

# Load environment variables before other imports
load_dotenv()

from models import GeneratePaperRequest, ExamAuditReport
from agent import exam_auditor_app
from db import questions_collection, used_questions_registry, redis_client

app = FastAPI(title="AI CBT Orchestration API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("MICROSERVICE_API_KEY", "default-dev-key")

async def verify_api_key(x_microservice_key: str = Header(...)):
    if x_microservice_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return x_microservice_key

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "cbt-ai-orchestration"}

MASTER_PAPER_TTL_SECONDS = int(os.getenv("MASTER_PAPER_TTL_SECONDS", "3600"))
CHECKPOINT_TTL_SECONDS = int(os.getenv("PAPER_CHECKPOINT_TTL_SECONDS", "7200"))


def _master_cache_key(exam_id: str) -> str:
    return f"exam:{exam_id}:master"


def _checkpoint_key(exam_id: str) -> str:
    return f"nest:checkpoint:{exam_id}:request"


def _load_cached_report(exam_id: str):
    if not redis_client:
        return None

    cached_report = redis_client.get(_master_cache_key(exam_id))
    if not cached_report:
        return None

    if isinstance(cached_report, bytes):
        cached_report = cached_report.decode("utf-8")

    return ExamAuditReport.model_validate_json(cached_report)


def _save_checkpoint(request: GeneratePaperRequest):
    if not redis_client:
        return

    redis_client.setex(
        _checkpoint_key(request.exam_id),
        CHECKPOINT_TTL_SECONDS,
        request.model_dump_json(),
    )


def _save_master_report(exam_id: str, final_report: ExamAuditReport):
    if not redis_client:
        return

    redis_client.setex(
        _master_cache_key(exam_id),
        MASTER_PAPER_TTL_SECONDS,
        final_report.model_dump_json(),
    )


from crypto_utils import decrypt_question_payload

def _run_generation(request: GeneratePaperRequest) -> ExamAuditReport:
    # Step 1: Query MongoDB (Excluding previous sessions)
    used_ids = []
    if request.previous_session_ids:
        # Assuming used_questions_registry stores docs like {"session_id": "...", "question_ids": [...]}
        cursor = used_questions_registry.find({"session_id": {"$in": request.previous_session_ids}})
        for session in cursor:
            used_ids.extend(session.get("question_ids", []))
            
    # Ensure uniqueness of used_ids
    used_ids = list(set(used_ids))

    candidate_pool = []
    for subj, count in request.required_counts.items():
        buffer_count = int(count * 1.5)
        
        pipeline = [
            {"$match": {"subject": subj, "sequence_id": {"$nin": used_ids}}},
            {"$sample": {"size": buffer_count}}
        ]
        
        cursor = questions_collection.aggregate(pipeline)
        for doc in cursor:
            # Decrypt payload
            try:
                encrypted_content = doc["encrypted_content"]
                pt_content = decrypt_question_payload(
                    encrypted_content["ciphertext"], 
                    encrypted_content["iv"]
                )
                candidate_pool.append({
                    "id": str(doc["sequence_id"]),
                    "subject": doc["subject"],
                    "topic": doc["topic"],
                    "difficulty": str(doc["difficulty"]), # Langchain prompt may expect str or int
                    "question_text": pt_content["question_text"],
                    "options": pt_content["options"],
                    "correct_option_index": pt_content["correct_option_index"],
                    "media_url": pt_content.get("media_url", "")
                })
            except Exception as e:
                print(f"Failed to decrypt question {doc.get('sequence_id')}: {e}")
                continue

    initial_state = {
        "exam_id": request.exam_id,
        "target_counts": request.required_counts,
        "target_difficulty": request.target_difficulty_distribution,
        "candidate_pool": candidate_pool,
        "current_selection": [],
        "audit_report": {},
        "retry_count": 0
    }

    result = exam_auditor_app.invoke(initial_state)
    final_report = result["audit_report"]
    return ExamAuditReport.model_validate(final_report)

@app.post("/api/v1/generate-paper", response_model=ExamAuditReport, dependencies=[Depends(verify_api_key)])
async def generate_paper(request: GeneratePaperRequest):
    try:
        cached_report = _load_cached_report(request.exam_id)
        if cached_report:
            return cached_report

        _save_checkpoint(request)
        final_report = _run_generation(request)
        _save_master_report(request.exam_id, final_report)
        return final_report

    except Exception as e:
        cached_report = _load_cached_report(request.exam_id)
        if cached_report:
            return cached_report

        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/recover-paper/{exam_id}", response_model=ExamAuditReport, dependencies=[Depends(verify_api_key)])
async def recover_paper(exam_id: str):
    cached_report = _load_cached_report(exam_id)
    if cached_report:
        return cached_report

    if not redis_client:
        raise HTTPException(status_code=503, detail="Recovery store unavailable.")

    checkpoint_payload = redis_client.get(_checkpoint_key(exam_id))
    if not checkpoint_payload:
        raise HTTPException(status_code=404, detail="No recoverable checkpoint found.")

    if isinstance(checkpoint_payload, bytes):
        checkpoint_payload = checkpoint_payload.decode("utf-8")

    request = GeneratePaperRequest.model_validate_json(checkpoint_payload)
    final_report = _run_generation(request)
    _save_master_report(exam_id, final_report)
    return final_report

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
