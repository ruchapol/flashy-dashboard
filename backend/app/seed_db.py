from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Any

from bson import ObjectId
from pymongo import ASCENDING

from app.db.mongo import mongo_client_manager


ROOT_DIR = Path(__file__).resolve().parents[2]
SEED_FILE = ROOT_DIR / "seed-data.json"


def _load_seed_data() -> dict[str, Any]:
    if not SEED_FILE.exists():
        raise FileNotFoundError(f"Seed file not found at {SEED_FILE}")

    raw = json.loads(SEED_FILE.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise ValueError("Seed file must contain a top-level JSON object")
    return raw


async def seed_database() -> None:
    data = _load_seed_data()
    db = mongo_client_manager.get_database()

    users: list[dict[str, Any]] = data.get("users", [])
    posts: list[dict[str, Any]] = data.get("posts", [])
    comments: list[dict[str, Any]] = data.get("comments", [])
    likes: list[dict[str, Any]] = data.get("likes", [])

    # Clear existing data so the seed is repeatable
    await db["likes"].delete_many({})
    await db["comments"].delete_many({})
    await db["posts"].delete_many({})
    await db["users"].delete_many({})

    # Ensure critical indexes for scale.
    # - likes: fast existence checks and fast bounded lookups per page
    await db["likes"].create_index([("user_id", ASCENDING), ("post_id", ASCENDING)], unique=True)

    user_id_map: dict[str, str] = {}
    post_id_map: dict[str, str] = {}

    # Insert users and record mapping from seed IDs to Mongo ObjectIds
    user_collection = db["users"]
    for user in users:
        doc = dict(user)
        original_id = str(doc.pop("_id"))
        result = await user_collection.insert_one(doc)
        user_id_map[original_id] = str(result.inserted_id)

    # Insert posts, remapping author_id to real user ObjectIds
    post_collection = db["posts"]
    for post in posts:
        doc = dict(post)
        original_id = str(doc.pop("_id"))
        original_author_id = str(doc["author_id"])

        if original_author_id not in user_id_map:
            raise KeyError(f"Unknown author_id in posts seed: {original_author_id}")

        doc["author_id"] = user_id_map[original_author_id]
        result = await post_collection.insert_one(doc)
        post_id_map[original_id] = str(result.inserted_id)

    # Insert comments, remapping post_id and author_id and setting post_oid
    comment_collection = db["comments"]
    for comment in comments:
        doc = dict(comment)
        doc.pop("_id", None)

        original_post_id = str(doc["post_id"])
        original_author_id = str(doc["author_id"])

        if original_post_id not in post_id_map:
            raise KeyError(f"Unknown post_id in comments seed: {original_post_id}")
        if original_author_id not in user_id_map:
            raise KeyError(f"Unknown author_id in comments seed: {original_author_id}")

        post_db_id = post_id_map[original_post_id]
        doc["post_id"] = post_db_id
        doc["post_oid"] = ObjectId(post_db_id)
        doc["author_id"] = user_id_map[original_author_id]

        await comment_collection.insert_one(doc)

    # Insert likes, remapping post_id and user_id and setting post_oid
    like_collection = db["likes"]
    for like in likes:
        doc = dict(like)
        doc.pop("_id", None)

        original_post_id = str(doc["post_id"])
        original_user_id = str(doc["user_id"])

        if original_post_id not in post_id_map:
            raise KeyError(f"Unknown post_id in likes seed: {original_post_id}")
        if original_user_id not in user_id_map:
            raise KeyError(f"Unknown user_id in likes seed: {original_user_id}")

        post_db_id = post_id_map[original_post_id]
        doc["post_id"] = post_db_id
        doc["post_oid"] = ObjectId(post_db_id)
        doc["user_id"] = user_id_map[original_user_id]

        await like_collection.insert_one(doc)


def main() -> None:
    asyncio.run(seed_database())


if __name__ == "__main__":
    main()

