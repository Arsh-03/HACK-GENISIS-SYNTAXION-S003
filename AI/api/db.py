import os
from pymongo import MongoClient
import redis

# MongoDB Connection
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
try:
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = mongo_client["cbt_database"]
    questions_collection = db["questions"]
    used_questions_registry = db["used_questions"]
except Exception as e:
    print(f"Warning: Could not connect to MongoDB. {e}")

# Redis Connection
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
try:
    redis_client = redis.from_url(REDIS_URL)
except Exception as e:
    print(f"Warning: Could not connect to Redis. {e}")
