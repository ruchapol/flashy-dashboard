from datetime import datetime

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.comment import CommentCreate, CommentInDB


def _to_object_id(id_str: str) -> ObjectId | None:
    try:
        return ObjectId(id_str)
    except Exception:
        return None


def _comment_from_doc(doc: dict) -> CommentInDB:
    return CommentInDB(
        id=str(doc["_id"]),
        post_id=doc["post_id"],
        author_id=doc["author_id"],
        created_at=doc["created_at"],
        text=doc["text"],
    )


async def create_comment(
    db: AsyncIOMotorDatabase,
    post_id: str,
    author_id: str,
    comment_in: CommentCreate,
) -> CommentInDB | None:
    post_oid = _to_object_id(post_id)
    if post_oid is None:
        return None

    now = datetime.utcnow()
    comment_collection = db["comments"]
    doc = {
        "post_id": post_id,
        "post_oid": post_oid,
        "author_id": author_id,
        "created_at": now,
        "text": comment_in.text,
    }
    result = await comment_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _comment_from_doc(doc)
