import os
import sys
import json
import argparse
import base64
import hashlib
from typing import Dict, Any, List, Optional
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne, ASCENDING, IndexModel
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def init_argparse() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Import, normalize, and encrypt question JSONs into MongoDB."
    )
    parser.add_argument(
        "--source", 
        type=str, 
        required=True, 
        help="Path to the Data folder containing subject subfolders."
    )
    parser.add_argument(
        "--mode", 
        type=str, 
        choices=["dry-run", "import"], 
        required=True, 
        help="Run in dry-run mode (no DB writes) or import mode."
    )
    parser.add_argument(
        "--subject-map", 
        type=str, 
        default="canonical",
        help="Subject mapping mode (canonical by default)."
    )
    return parser

# Normalization Mappings
SUBJECT_MAP = {
    "phy": "Physics",
    "physics": "Physics",
    "chem": "Chemistry",
    "chemistry": "Chemistry",
    "botany": "Botany",
    "zoology": "Zoology"
}

def normalize_difficulty(val: Any) -> Optional[int]:
    if isinstance(val, str):
        v = val.lower()
        if v in ["medium", "easy", "0"]: return 1
        if v in ["hard", "1"]: return 2
        if v in ["advanced", "2"]: return 3
    elif isinstance(val, int):
        if val == 0: return 1
        if val == 1: return 2
        if val == 2: return 3
        # If it's already 1, 2, 3
        if val in [1, 2, 3]: return val
    return None

def encrypt_payload(aesgcm: AESGCM, payload: dict) -> dict:
    iv = os.urandom(12)
    plaintext = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    ciphertext = aesgcm.encrypt(iv, plaintext, None)
    return {
        "ciphertext": base64.b64encode(ciphertext).decode('utf-8'),
        "iv": base64.b64encode(iv).decode('utf-8')
    }

def generate_hash(record: dict, previous_hash: str) -> str:
    hash_input = {
        "sequence_id": record["sequence_id"],
        "subject": record["subject"],
        "topic": record["topic"],
        "difficulty": record["difficulty"],
        "chapter_name": record["chapter_name"],
        "chapter_number": record["chapter_number"],
        "status": record["status"],
        "ciphertext": record["encrypted_content"]["ciphertext"],
        "iv": record["encrypted_content"]["iv"],
        "previous_hash": previous_hash
    }
    hash_str = json.dumps(hash_input, sort_keys=True)
    return hashlib.sha256(hash_str.encode('utf-8')).hexdigest()

def process_file(file_path: Path, aesgcm: AESGCM, previous_hash: str) -> tuple[List[dict], List[dict]]:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        return [], [{"file": str(file_path), "error": f"Failed to parse JSON: {e}"}]

    if not isinstance(data, list):
        return [], [{"file": str(file_path), "error": "Top-level JSON value must be an array"}]

    valid_records = []
    rejected_records = []
    curr_hash = previous_hash

    for i, item in enumerate(data):
        # 1. Validation
        required_keys = ["sequence_id", "subject", "chapter_name", "chapter_number", "topic", "difficulty", "status", "plaintext_content"]
        if any(k not in item for k in required_keys):
            rejected_records.append({"file": str(file_path), "index": i, "error": "Missing required top-level fields"})
            continue
            
        pt_content = item["plaintext_content"]
        pt_keys = ["question_text", "options", "correct_option_index"]
        if any(k not in pt_content for k in pt_keys):
            rejected_records.append({"file": str(file_path), "index": i, "error": "Missing required plaintext_content fields"})
            continue

        if not isinstance(pt_content["question_text"], str) or not pt_content["question_text"].strip():
            rejected_records.append({"file": str(file_path), "index": i, "error": "question_text must be non-empty string"})
            continue
            
        if not isinstance(pt_content["options"], list) or len(pt_content["options"]) != 4:
            rejected_records.append({"file": str(file_path), "index": i, "error": "options must be an array of exactly 4 elements"})
            continue
            
        if not isinstance(pt_content["correct_option_index"], int) or pt_content["correct_option_index"] < 0 or pt_content["correct_option_index"] > 3:
            rejected_records.append({"file": str(file_path), "index": i, "error": "correct_option_index must be between 0 and 3"})
            continue
            
        if not isinstance(item["chapter_number"], (int, float)):
            rejected_records.append({"file": str(file_path), "index": i, "error": "chapter_number must be numeric"})
            continue

        if item["status"] != "APPROVED":
            rejected_records.append({"file": str(file_path), "index": i, "error": f"Skipped status {item['status']}"})
            continue

        # 2. Normalization
        subj = item["subject"].lower()
        if subj not in SUBJECT_MAP:
            rejected_records.append({"file": str(file_path), "index": i, "error": f"Unknown subject {item['subject']}"})
            continue
        normalized_subject = SUBJECT_MAP[subj]

        diff = normalize_difficulty(item["difficulty"])
        if diff is None:
            rejected_records.append({"file": str(file_path), "index": i, "error": f"Unknown difficulty {item['difficulty']}"})
            continue
            
        media_url = pt_content.get("media_url")
        if media_url is None:
            media_url = ""

        # 3. Encryption
        sensitive_payload = {
            "question_text": pt_content["question_text"],
            "options": pt_content["options"],
            "correct_option_index": pt_content["correct_option_index"],
            "media_url": media_url
        }
        
        try:
            encrypted_content = encrypt_payload(aesgcm, sensitive_payload)
        except Exception as e:
            rejected_records.append({"file": str(file_path), "index": i, "error": f"Encryption failed: {e}"})
            continue

        # 4. Construct Target Record
        now = datetime.now(timezone.utc).isoformat()
        
        offset = {"Physics": 100000, "Chemistry": 200000, "Botany": 300000, "Zoology": 400000}.get(normalized_subject, 0)
        global_sequence_id = offset + (int(item["chapter_number"]) * 1000) + item["sequence_id"]
        
        target = {
            "sequence_id": global_sequence_id,
            "subject": normalized_subject,
            "topic": item["topic"],
            "difficulty": diff,
            "chapter_name": item["chapter_name"],
            "chapter_number": item["chapter_number"],
            "status": "APPROVED",
            "is_encrypted": True,
            "encrypted_content": encrypted_content,
            "previous_hash": curr_hash,
            "created_at": item.get("created_at", now),
            "updated_at": now
        }
        
        # 5. Hash
        target["current_hash"] = generate_hash(target, curr_hash)
        curr_hash = target["current_hash"]
        
        valid_records.append(target)
        
    return valid_records, rejected_records

def main():
    parser = init_argparse()
    args = parser.parse_args()

    load_dotenv()
    source_dir = Path(args.source)
    
    if not source_dir.exists() or not source_dir.is_dir():
        print(f"Error: Source directory {source_dir} does not exist.")
        sys.exit(1)

    key_b64 = os.getenv("MASTER_ENCRYPTION_KEY")
    if not key_b64:
        print("Error: MASTER_ENCRYPTION_KEY environment variable not set.")
        sys.exit(1)
        
    try:
        key_bytes = base64.b64decode(key_b64)
        if len(key_bytes) != 32:
            print("Error: MASTER_ENCRYPTION_KEY must be 32 bytes for AES-256.")
            sys.exit(1)
        aesgcm = AESGCM(key_bytes)
    except Exception as e:
        print(f"Error parsing encryption key: {e}")
        sys.exit(1)
        
    mode = args.mode
    mongo_client = None
    db = None
    questions_col = None
    
    if mode == "import":
        mongo_uri = os.getenv("MONGODB_URI")
        if not mongo_uri:
            print("Error: MONGODB_URI environment variable not set.")
            sys.exit(1)
        import certifi
        mongo_client = MongoClient(mongo_uri, tlsCAFile=certifi.where())
        # We can extract the DB name from the URI or default to 'neetcbt' based on the connection string
        # Let's just use the default DB from the connection string or 'test'
        db = mongo_client.get_default_database("neetcbt")
        questions_col = db["questions"]
        
        # Ensure indexes
        indexes = [
            IndexModel([("sequence_id", ASCENDING)], unique=True),
            IndexModel([("subject", ASCENDING), ("status", ASCENDING), ("difficulty", ASCENDING)]),
            IndexModel([("chapter_name", ASCENDING), ("chapter_number", ASCENDING)]),
            IndexModel([("current_hash", ASCENDING)], unique=True)
        ]
        questions_col.create_indexes(indexes)

    all_valid = []
    all_rejected = []
    previous_hash = "GENESIS_HASH"
    
    # Process files
    # Subject directories can be anything like Phy, Chem, etc.
    for root, dirs, files in os.walk(source_dir):
        for f in files:
            if f.lower().endswith(".json"):
                fpath = Path(root) / f
                print(f"Processing {fpath}...")
                valid, rejected = process_file(fpath, aesgcm, previous_hash)
                all_valid.extend(valid)
                all_rejected.extend(rejected)
                if valid:
                    previous_hash = valid[-1]["current_hash"]

    # In dry-run mode, we just report
    print("\n--- Validation Report ---")
    print(f"Total Valid Records: {len(all_valid)}")
    print(f"Total Rejected/Skipped Records: {len(all_rejected)}")
    
    if all_rejected:
        print("\nRejected Sample:")
        for r in all_rejected[:10]:
            print(f" - {r}")
        if len(all_rejected) > 10:
            print(f"... and {len(all_rejected) - 10} more.")

    if mode == "import" and all_valid:
        print("\n--- Importing to MongoDB ---")
        operations = []
        for doc in all_valid:
            operations.append(
                UpdateOne(
                    {"sequence_id": doc["sequence_id"]},
                    {"$set": doc},
                    upsert=True
                )
            )
            
        # Bulk write
        try:
            result = questions_col.bulk_write(operations, ordered=True)
            print(f"Import complete: {result.upserted_count} inserted, {result.modified_count} updated.")
        except Exception as e:
            print(f"Error during bulk import: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
