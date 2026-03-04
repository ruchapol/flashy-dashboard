from datetime import datetime

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from passlib.context import CryptContext

from app.schemas.user import Role, UserCreate, UserInDB


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _hash_password(password: str) -> str:
    return pwd_context.hash(password)


async def get_user_by_email(db: AsyncIOMotorDatabase, email: str) -> UserInDB | None:
    user_collection = db["users"]
    doc = await user_collection.find_one({"email": email})
    if not doc:
        return None
    return UserInDB(
        id=str(doc["_id"]),
        username=doc["username"],
        email=doc["email"],
        role=doc.get("role", "user"),
        created_at=doc["created_at"],
    )


async def get_user_by_id(db: AsyncIOMotorDatabase, user_id: str) -> UserInDB | None:
    try:
        oid = ObjectId(user_id)
    except Exception:
        return None
    user_collection = db["users"]
    doc = await user_collection.find_one({"_id": oid})
    if not doc:
        return None
    return UserInDB(
        id=str(doc["_id"]),
        username=doc["username"],
        email=doc["email"],
        role=doc.get("role", "user"),
        created_at=doc["created_at"],
    )


async def create_user(
    db: AsyncIOMotorDatabase,
    user_in: UserCreate,
    role: Role = "user",
) -> UserInDB:
    now = datetime.utcnow()
    user_collection = db["users"]
    doc = {
        "username": user_in.username,
        "email": user_in.email,
        "password_hash": _hash_password(user_in.password),
        "role": role,
        "created_at": now,
    }
    result = await user_collection.insert_one(doc)
    return UserInDB(
        id=str(result.inserted_id),
        username=user_in.username,
        email=user_in.email,
        role=role,
        created_at=now,
    )


async def verify_user_credentials(
    db: AsyncIOMotorDatabase,
    email: str,
    password: str,
) -> UserInDB | None:
    user_collection = db["users"]
    doc = await user_collection.find_one({"email": email})
    if not doc:
        return None
    if not pwd_context.verify(password, doc["password_hash"]):
        return None
    return UserInDB(
        id=str(doc["_id"]),
        username=doc["username"],
        email=doc["email"],
        role=doc.get("role", "user"),
        created_at=doc["created_at"],
    )

