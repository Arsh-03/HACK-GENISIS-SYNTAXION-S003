import os
from pymongo import MongoClient
import redis

# MongoDB Connection
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
try:
    import certifi
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tlsCAFile=certifi.where())
    db = mongo_client.get_database("neetcbt")
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
