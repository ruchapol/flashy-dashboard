from datetime import datetime

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.like import LikeInDB


def _to_object_id(id_str: str) -> ObjectId | None:
    try:
        return ObjectId(id_str)
    except Exception:
        return None


async def create_like(
    db: AsyncIOMotorDatabase, post_id: str, user_id: str
) -> tuple[LikeInDB, bool] | None:
    post_oid = _to_object_id(post_id)
    if post_oid is None:
        return None

    like_collection = db["likes"]
    existing = await like_collection.find_one({"post_id": post_id, "user_id": user_id})
    if existing:
        return (LikeInDB(post_id=post_id, user_id=user_id, created_at=existing["created_at"]), False)

    now = datetime.utcnow()
    doc = {"post_id": post_id, "post_oid": post_oid, "user_id": user_id, "created_at": now}
    await like_collection.insert_one(doc)
    return (LikeInDB(post_id=post_id, user_id=user_id, created_at=now), True)


async def delete_like(db: AsyncIOMotorDatabase, post_id: str, user_id: str) -> bool | None:
    post_oid = _to_object_id(post_id)
    if post_oid is None:
        return None
    like_collection = db["likes"]
    result = await like_collection.delete_one({"post_id": post_id, "user_id": user_id})
    return result.deleted_count == 1


async def is_post_liked_by_user(
    db: AsyncIOMotorDatabase,
    post_id: str,
    user_id: str,
) -> bool:
    like_collection = db["likes"]
    existing = await like_collection.find_one(
        {"post_id": post_id, "user_id": user_id},
        {"_id": 1},
    )
    return existing is not None


async def list_liked_post_ids_for_user(
    db: AsyncIOMotorDatabase,
    user_id: str,
    post_ids: list[str],
) -> set[str]:
    if not post_ids:
        return set()

    like_collection = db["likes"]
    cursor = like_collection.find(
        {"user_id": user_id, "post_id": {"$in": post_ids}},
        {"post_id": 1},
    )

    liked_post_ids: set[str] = set()
    async for doc in cursor:
        post_id = doc.get("post_id")
        if isinstance(post_id, str):
            liked_post_ids.add(post_id)

    return liked_post_ids
