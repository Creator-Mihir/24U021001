import os

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv(
    "DATABASE_NAME",
    "indian_cultural_heritage"
)

client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]

heritage_collection = db["heritage"]
categories_collection = db["categories"]
users_collection = db["users"]