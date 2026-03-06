from motor.motor_asyncio import AsyncIOMotorDatabase

import app.repositories.comment_repository as comment_repository
import app.repositories.like_repository as like_repository
import app.repositories.post_repository as post_repository
import app.repositories.user_repository as user_repository
from app.schemas.comment import CommentCreate, CommentInDB, CommentPublic
from app.schemas.like import LikeInDB
from app.schemas.post import PostCreate, PostInDB, PostUpdate


async def get_posts(db: AsyncIOMotorDatabase) -> list[PostInDB]:
    return await post_repository.get_posts(db)


async def get_posts_page(
    db: AsyncIOMotorDatabase,
    limit: int,
    cursor: str | None = None,
) -> tuple[list[PostInDB], str | None]:
    return await post_repository.get_posts_page(db, limit=limit, cursor=cursor)


async def get_post_by_id(db: AsyncIOMotorDatabase, post_id: str) -> PostInDB | None:
    return await post_repository.get_post_by_id(db, post_id)


async def create_post(db: AsyncIOMotorDatabase, author_id: str, post_in: PostCreate) -> PostInDB:
    return await post_repository.create_post(db, author_id, post_in)


async def edit_post(
    db: AsyncIOMotorDatabase,
    post_id: str,
    actor_user_id: str,
    post_update: PostUpdate,
) -> PostInDB | None:
    existing = await post_repository.get_post_by_id(db, post_id)
    if not existing:
        return None
    if existing.author_id != actor_user_id:
        raise PermissionError("Only the author can edit this post")
    return await post_repository.update_post(db, post_id, post_update)


async def add_comment(
    db: AsyncIOMotorDatabase,
    post_id: str,
    author_id: str,
    comment_in: CommentCreate,
) -> CommentInDB | None:
    existing = await post_repository.get_post_by_id(db, post_id)
    if not existing:
        return None
    comment = await comment_repository.create_comment(db, post_id, author_id, comment_in)
    if not comment:
        return None
    await post_repository.increment_comment_count(db, post_id, 1)
    return comment


async def like_post(db: AsyncIOMotorDatabase, post_id: str, user_id: str) -> LikeInDB | None:
    existing = await post_repository.get_post_by_id(db, post_id)
    if not existing:
        return None

    result = await like_repository.create_like(db, post_id, user_id)
    if not result:
        return None
    like, created = result
    if created:
        await post_repository.increment_like_count(db, post_id, 1)
    return like


async def unlike_post(db: AsyncIOMotorDatabase, post_id: str, user_id: str) -> bool | None:
    existing = await post_repository.get_post_by_id(db, post_id)
    if not existing:
        return None

    deleted = await like_repository.delete_like(db, post_id, user_id)
    if deleted:
        await post_repository.increment_like_count(db, post_id, -1)
    return deleted


async def get_comments_for_post(
    db: AsyncIOMotorDatabase,
    post_id: str,
) -> list[CommentPublic] | None:
    existing = await post_repository.get_post_by_id(db, post_id)
    if not existing:
        return None

    comments = await comment_repository.list_comments_for_post(db, post_id)
    if not comments:
        return []

    author_ids = {comment.author_id for comment in comments}
    users = await user_repository.get_users_by_ids(db, list(author_ids))
    user_by_id = {user.id: user for user in users}

    return [
        CommentPublic(
            **comment.model_dump(),
            author_username=user_by_id.get(comment.author_id).username
            if user_by_id.get(comment.author_id)
            else comment.author_id,
        )
        for comment in comments
    ]
