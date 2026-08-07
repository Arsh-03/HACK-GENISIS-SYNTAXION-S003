import os
import random
from datetime import datetime, timedelta
from pymongo import MongoClient
import certifi
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tlsCAFile=certifi.where())
db = mongo_client.get_default_database("neetcbt")

exams_col = db["exams"]
attempts_col = db["candidate_attempts"]
logs_col = db["proctoring_logs"]
users_col = db["users"]

def setup():
    print("Cleaning up old mock dashboard data...")
    exams_col.delete_many({"exam_code": "NEET_UG_2026"})
    attempts_col.delete_many({"session_id": "DAY_01_SHIFT_01_MORNING"})
    
    # We'll just drop all proctoring logs for this session to be safe
    logs_col.delete_many({})

def generate_exam():
    exam_doc = {
        "exam_code": "NEET_UG_2026",
        "title": "National Eligibility cum Entrance Test (UG) 2026",
        "total_duration_minutes": 180,
        "total_marks": 720,
        "marking_scheme": {
            "correct_marks": 4,
            "incorrect_marks": -1,
            "unattempted_marks": 0
        },
        "blueprint": {
            "Physics": {"required_count": 45, "section_weightage": 0.25},
            "Chemistry": {"required_count": 45, "section_weightage": 0.25},
            "Biology_Botany": {"required_count": 45, "section_weightage": 0.25},
            "Biology_Zoology": {"required_count": 45, "section_weightage": 0.25}
        },
        "target_difficulty_distribution": {
            "Easy": 0.35,
            "Medium": 0.45,
            "Hard": 0.20
        },
        "status": "ACTIVE",
        "start_time": datetime.utcnow() - timedelta(minutes=60),
        "end_time": datetime.utcnow() + timedelta(minutes=120)
    }
    result = exams_col.insert_one(exam_doc)
    return result.inserted_id

def generate_attempts_and_logs(exam_id):
    users = list(users_col.find({"roll_number": {"$regex": "^2026-NEET-"}}))
    if not users:
        print("No mock users found. Please run import_users.py first.")
        return

    print(f"Generating attempts for {len(users)} users...")
    
    attempts = []
    logs = []
    
    # Predefined question IDs to simulate a paper
    q_ids = [f"q_{i}" for i in range(180)]
    
    for u in users:
        status = random.choice(["IN_PROGRESS", "IN_PROGRESS", "IN_PROGRESS", "SUBMITTED"])
        
        correct = random.randint(50, 150)
        incorrect = random.randint(10, 30)
        unattempted = 180 - correct - incorrect
        raw_score = (correct * 4) + (incorrect * -1)
        
        responses = []
        # Generate some mock responses
        for q in q_ids[:(correct + incorrect)]:
            responses.append({
                "question_id": q,
                "selected_option_index": random.randint(0, 3),
                "state": "ANSWERED",
                "time_spent_seconds": random.randint(10, 120),
                "updated_at": datetime.utcnow() - timedelta(minutes=random.randint(1, 50))
            })
            
        attempt_doc = {
            "candidate_id": u["_id"],
            "exam_id": exam_id,
            "session_id": "DAY_01_SHIFT_01_MORNING",
            "terminal_id": u.get("assigned_terminal_id", "TERM_100"),
            "seed": "b4c2d3e4f5a6...",
            "status": status,
            "responses": responses,
            "score_summary": {
                "raw_score": raw_score,
                "percentile_score": random.uniform(85.0, 99.9),
                "correct_count": correct,
                "incorrect_count": incorrect,
                "unattempted_count": unattempted
            },
            "started_at": datetime.utcnow() - timedelta(minutes=random.randint(30, 60)),
            "submitted_at": datetime.utcnow() if status == "SUBMITTED" else None
        }
        attempts.append(attempt_doc)
    
    # Insert attempts to get their IDs
    result = attempts_col.insert_many(attempts)
    attempt_ids = result.inserted_ids
    
    print(f"Inserted {len(attempt_ids)} attempts.")
    
    print("Generating proctoring logs for CENTER_DEMO_01 users...")
    
    # Generate proctoring logs for a subset of demo users
    demo_users = [u for u in users if u.get("assigned_center_id") == "CENTER_DEMO_01"]
    
    flagged_users = random.sample(demo_users, min(5, len(demo_users)))
    
    for flag_u in flagged_users:
        # Find their attempt ID
        att_id = None
        for i, a in enumerate(attempts):
            if a["candidate_id"] == flag_u["_id"]:
                att_id = attempt_ids[i]
                break
                
        if not att_id: continue
        
        # Generate 1-3 logs
        for strike in range(1, random.randint(2, 4)):
            event_type = random.choice(["MULTIPLE_FACES_DETECTED", "TAB_SWITCH", "AUDIO_ANOMALY", "NO_FACE_DETECTED"])
            severity = "WARNING" if strike < 3 else "CRITICAL"
            
            log_doc = {
                "attempt_id": att_id,
                "candidate_id": flag_u["_id"],
                "event_type": event_type,
                "severity": severity,
                "strike_number": strike,
                "details": {
                    "duration_ms": random.randint(1000, 5000),
                    "description": f"AI flagged {event_type} during section traversal."
                },
                "timestamp": datetime.utcnow() - timedelta(minutes=random.randint(1, 30))
            }
            logs.append(log_doc)
            
    if logs:
        logs_col.insert_many(logs)
        print(f"Inserted {len(logs)} proctoring logs.")
        
        print("\n--- CHEATING ALERTS GENERATED FOR ---")
        for fu in flagged_users:
            print(f"Name: {fu['full_name']} | Email: {fu['email']}")

if __name__ == "__main__":
    setup()
    exam_id = generate_exam()
    print(f"Created Exam: NEET_UG_2026 with ID {exam_id}")
    generate_attempts_and_logs(exam_id)
    print("Dashboard Data Population Complete!")
