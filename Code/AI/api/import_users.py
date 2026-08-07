import os
import random
import string
import bcrypt
from datetime import datetime
from pymongo import MongoClient
import certifi
from dotenv import load_dotenv

load_dotenv()

# MongoDB Connection
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
print("Connecting to MongoDB Atlas...")
mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tlsCAFile=certifi.where())
db = mongo_client.get_default_database("neetcbt")
users_collection = db["users"]

def setup_indexes():
    print("Setting up indexes...")
    users_collection.create_index("roll_number", unique=True)
    users_collection.create_index("email", unique=True)
    users_collection.create_index("assigned_center_id")

def hash_password(password: str) -> str:
    # Use standard 12 rounds
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12)).decode('utf-8')

def generate_mock_users(count=50):
    users = []
    
    # We'll use a common password for testing purposes
    default_password = "password123"
    print(f"Hashing default password '{default_password}' for all mock users...")
    common_hash = hash_password(default_password)
    
    first_names = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Diya", "Isha", "Riya", "Aanya", "Ananya", "Aadhya", "Kavya", "Saanvi", "Pari", "Navya"]
    last_names = ["Sharma", "Patel", "Singh", "Kumar", "Rao", "Das", "Reddy", "Verma", "Yadav", "Gupta", "Mishra", "Jain", "Bose", "Choudhury", "Nair", "Pillai", "Menon"]
    
    centers = ["CENTER_DEMO_01", "CENTER_BLR_01", "CENTER_BLR_02", "CENTER_DEL_01", "CENTER_MUM_01"]
    
    for i in range(1, count + 1):
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        
        # Guarantee a large portion (e.g., 20) are in the DEMO center for the judges
        if i <= 20:
            center = "CENTER_DEMO_01"
        else:
            center = random.choice(centers)
            
        terminal_num = random.randint(100, 999)
        
        user_doc = {
            "roll_number": f"2026-NEET-{i:05d}",
            "full_name": f"{fname} {lname}",
            "email": f"{fname.lower()}.{lname.lower()}{i}@example.com",
            "password_hash": common_hash,
            "role": "STUDENT",
            "assigned_center_id": center,
            "assigned_terminal_id": f"TERM_{terminal_num}",
            "is_active": True,
            "created_at": datetime.utcnow()
        }
        users.append(user_doc)
        
    return users

if __name__ == "__main__":
    setup_indexes()
    
    # Check if we already have mock users to avoid DuplicateKey errors
    existing = users_collection.count_documents({"roll_number": {"$regex": "^2026-NEET-"}})
    if existing > 0:
        print(f"Found {existing} existing mock users. Cleaning them up first...")
        users_collection.delete_many({"roll_number": {"$regex": "^2026-NEET-"}})
        
    print("Generating 50 mock users...")
    mock_users = generate_mock_users(50)
    
    print("Inserting into MongoDB...")
    result = users_collection.insert_many(mock_users)
    print(f"Successfully inserted {len(result.inserted_ids)} users.")
    print("\n--- DEMO ACCOUNTS ---")
    print("Center: CENTER_DEMO_01")
    print("Login Password for all accounts: password123")
    print(f"Example Username 1: {mock_users[0]['email']}")
    print(f"Example Username 2: {mock_users[1]['email']}")
