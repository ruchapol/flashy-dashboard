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

    existing = await db["likes"].find_one({"post_id": post_id, "user_id": user_id})
    if existing:
        return (LikeInDB(post_id=post_id, user_id=user_id, created_at=existing["created_at"]), False)

    now = datetime.utcnow()
    doc = {"post_id": post_id, "post_oid": post_oid, "user_id": user_id, "created_at": now}
    await db["likes"].insert_one(doc)
    return (LikeInDB(post_id=post_id, user_id=user_id, created_at=now), True)


async def delete_like(db: AsyncIOMotorDatabase, post_id: str, user_id: str) -> bool | None:
    post_oid = _to_object_id(post_id)
    if post_oid is None:
        return None
    result = await db["likes"].delete_one({"post_id": post_id, "user_id": user_id})
    return result.deleted_count == 1
