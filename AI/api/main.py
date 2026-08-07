from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import json

# Load environment variables before other imports
load_dotenv()

from models import GeneratePaperRequest, ExamAuditReport
from agent import exam_auditor_app
from db import questions_collection, used_questions_registry, redis_client

app = FastAPI(title="AI CBT Orchestration API", version="1.0.0")

@app.post("/api/v1/generate-paper", response_model=ExamAuditReport)
async def generate_paper(request: GeneratePaperRequest):
    try:
        # Step 1: Query MongoDB (Excluding previous sessions)
        # Mock logic to represent the 1.5x buffer extraction
        # In reality, this would be: questions_collection.find({"_id": {"$nin": used_ids}, "subject": ...})
        candidate_pool = []
        for subj, count in request.required_counts.items():
            # Mock generating 1.5x buffer
            buffer_count = int(count * 1.5)
            for i in range(buffer_count):
                candidate_pool.append({
                    "id": f"q_{subj.lower()}_{i}",
                    "subject": subj,
                    "topic": "General",
                    "difficulty": 1, # Mocked (enum: 1=Medium,2=Hard,3=Advanced)
                    "question_text": f"Sample question {i} for {subj}?",
                    "options": ["A", "B", "C", "D"],
                    "correct_option_index": 0
                })

        # Step 2 & 3 & 4: LangGraph Auditor Pipeline
        initial_state = {
            "exam_id": request.exam_id,
            "target_counts": request.required_counts,
            "target_difficulty": request.target_difficulty_distribution,
            "candidate_pool": candidate_pool,
            "current_selection": [],
            "audit_report": {},
            "retry_count": 0
        }

        # Invoke LangGraph
        result = exam_auditor_app.invoke(initial_state)
        final_report = result["audit_report"]

        # Step 6: Encryption & Redis Caching
        if redis_client:
            # Mocking encryption
            encrypted_payload = json.dumps(final_report["final_questions"]) # Should be AES-256 encrypted
            redis_client.setex(f"exam:{request.exam_id}:master", 3600, encrypted_payload)

        # Step 7: GC Flush (Handled mostly by Python automatically at end of request scope, but explicit possible)

        return final_report

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
