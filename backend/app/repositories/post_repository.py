from datetime import datetime

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ReturnDocument

from app.schemas.post import PostCreate, PostInDB, PostUpdate


def _to_object_id(id_str: str) -> ObjectId | None:
    try:
        return ObjectId(id_str)
    except Exception:
        return None


def _post_from_doc(doc: dict) -> PostInDB:
    return PostInDB(
        id=str(doc["_id"]),
        author_id=doc["author_id"],
        created_at=doc["created_at"],
        equation_text=doc["equation_text"],
        x_min=doc["x_min"],
        x_max=doc["x_max"],
        y_min=doc.get("y_min"),
        y_max=doc.get("y_max"),
        y_auto=doc.get("y_auto", True),
        caption=doc.get("caption", ""),
        like_count=doc.get("like_count", 0),
        comment_count=doc.get("comment_count", 0),
    )


async def get_posts(db: AsyncIOMotorDatabase) -> list[PostInDB]:
    post_collection = db["posts"]
    docs = await post_collection.find().sort("created_at", -1).to_list(length=None)
    return [_post_from_doc(doc) for doc in docs]

async def get_posts_by_author_id(db: AsyncIOMotorDatabase, author_id: str) -> list[PostInDB]:
    post_collection = db["posts"]
    docs = await post_collection.find({"author_id": author_id}).sort("created_at", -1).to_list(length=None)
    return [_post_from_doc(doc) for doc in docs]

async def create_post(db: AsyncIOMotorDatabase, author_id: str, post_in: PostCreate) -> PostInDB:
    now = datetime.utcnow()
    post_collection = db["posts"]
    doc = {
        "author_id": author_id,
        "created_at": now,
        "equation_text": post_in.equation_text,
        "x_min": post_in.x_min,
        "x_max": post_in.x_max,
        "y_min": post_in.y_min,
        "y_max": post_in.y_max,
        "y_auto": post_in.y_auto,
        "caption": post_in.caption,
        "like_count": 0,
        "comment_count": 0,
    }
    result = await post_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _post_from_doc(doc)


async def get_post_by_id(db: AsyncIOMotorDatabase, post_id: str) -> PostInDB | None:
    oid = _to_object_id(post_id)
    if oid is None:
        return None
    post_collection = db["posts"]
    doc = await post_collection.find_one({"_id": oid})
    if not doc:
        return None
    return _post_from_doc(doc)


async def update_post(
    db: AsyncIOMotorDatabase,
    post_id: str,
    post_update: PostUpdate,
) -> PostInDB | None:
    oid = _to_object_id(post_id)
    if oid is None:
        return None

    post_collection = db["posts"]
    update: dict = {}
    for field, value in post_update.model_dump(exclude_unset=True).items():
        update[field] = value

    if not update:
        doc = await post_collection.find_one({"_id": oid})
        return _post_from_doc(doc) if doc else None

    doc = await post_collection.find_one_and_update(
        {"_id": oid},
        {"$set": update},
        return_document=ReturnDocument.AFTER,
    )
    if not doc:
        return None
    return _post_from_doc(doc)


async def increment_comment_count(db: AsyncIOMotorDatabase, post_id: str, delta: int) -> bool:
    oid = _to_object_id(post_id)
    if oid is None:
        return False
    post_collection = db["posts"]
    result = await post_collection.update_one({"_id": oid}, {"$inc": {"comment_count": delta}})
    return result.matched_count == 1


async def increment_like_count(db: AsyncIOMotorDatabase, post_id: str, delta: int) -> bool:
    oid = _to_object_id(post_id)
    if oid is None:
        return False
    post_collection = db["posts"]
    result = await post_collection.update_one({"_id": oid}, {"$inc": {"like_count": delta}})
    return result.matched_count == 1
