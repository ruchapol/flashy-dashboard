from datetime import datetime

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.user import Role, UserCreate, UserInDB, UserInDBWithPasswordHash


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


async def get_user_auth_by_email(
    db: AsyncIOMotorDatabase,
    email: str,
) -> UserInDBWithPasswordHash | None:
    user_collection = db["users"]
    doc = await user_collection.find_one({"email": email})
    if not doc:
        return None
    return UserInDBWithPasswordHash(
        id=str(doc["_id"]),
        username=doc["username"],
        email=doc["email"],
        role=doc.get("role", "user"),
        created_at=doc["created_at"],
        password_hash=doc["password_hash"],
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
    password_hash: str,
    role: Role = "user",
) -> UserInDB:
    now = datetime.utcnow()
    user_collection = db["users"]
    doc = {
        "username": user_in.username,
        "email": user_in.email,
        "password_hash": password_hash,
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


async def get_users_by_ids(
    db: AsyncIOMotorDatabase,
    user_ids: list[str],
) -> list[UserInDB]:
    if not user_ids:
        return []

    try:
        object_ids = [ObjectId(user_id) for user_id in user_ids]
    except Exception:
        return []

    user_collection = db["users"]
    cursor = user_collection.find({"_id": {"$in": object_ids}})
    users: list[UserInDB] = []
    async for doc in cursor:
        users.append(
            UserInDB(
                id=str(doc["_id"]),
                username=doc["username"],
                email=doc["email"],
                role=doc.get("role", "user"),
                created_at=doc["created_at"],
            )
        )
    return users