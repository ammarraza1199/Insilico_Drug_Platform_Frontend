# database.py
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    db.client = AsyncIOMotorClient(settings.mongo_uri)
    db.db = db.client.get_database() # Uses db name from URI or defaults
    logger.info("Connected to MongoDB", db_name=db.db.name)

async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    if db.client:
        db.client.close()
    logger.info("MongoDB connection closed.")
