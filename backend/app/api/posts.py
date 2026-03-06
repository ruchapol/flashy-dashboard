from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.db.mongo import get_database
from app.schemas.comment import CommentCreate, CommentPublic
from app.schemas.like import LikePublic
from app.schemas.post import PostCreate, PostListResponse, PostPublic, PostUpdate
from app.schemas.user import UserInDB
from app.services import post_service
import app.repositories.user_repository as user_repository
import app.repositories.like_repository as like_repository


router = APIRouter(tags=["posts"])


@router.get("/posts", response_model=PostListResponse, status_code=status.HTTP_200_OK)
async def get_post(
    db: AsyncIOMotorDatabase = Depends(get_database),
    user: UserInDB = Depends(get_current_user),
    limit: int = Query(10, ge=1, le=100),
    cursor: str | None = Query(None),
) -> PostListResponse:
    posts, next_cursor = await post_service.get_posts_page(db, limit=limit, cursor=cursor)

    author_ids = {post.author_id for post in posts}
    authors = await user_repository.get_users_by_ids(db, list(author_ids))
    author_by_id = {author.id: author for author in authors}

    liked_post_ids = await like_repository.list_liked_post_ids_for_user(
        db,
        user.id,
        [post.id for post in posts],
    )

    return PostListResponse(
        items=[
            PostPublic(
                **post.model_dump(),
                author_username=author_by_id.get(post.author_id).username
                if author_by_id.get(post.author_id)
                else post.author_id,
                is_current_user_liked=post.id in liked_post_ids,
            )
            for post in posts
        ],
        next_cursor=next_cursor,
    )


@router.post("/posts", response_model=PostPublic, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_in: PostCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    user: UserInDB = Depends(get_current_user),
) -> PostPublic:
    post = await post_service.create_post(db, user.id, post_in)
    return PostPublic(
        **post.model_dump(),
        author_username=user.username,
        is_current_user_liked=False,
    )


@router.get("/posts/{post_id}", response_model=PostPublic, status_code=status.HTTP_200_OK)
async def get_post_by_id(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    user: UserInDB = Depends(get_current_user),
) -> PostPublic:
    post = await post_service.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    author = await user_repository.get_user_by_id(db, post.author_id)

    is_current_user_liked = await like_repository.is_post_liked_by_user(db, post.id, user.id)

    return PostPublic(
        **post.model_dump(),
        author_username=author.username if author else post.author_id,
        is_current_user_liked=is_current_user_liked,
    )


@router.patch("/posts/{post_id}", response_model=PostPublic)
async def edit_post(
    post_id: str,
    post_update: PostUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    user: UserInDB = Depends(get_current_user),
) -> PostPublic:
    try:
        post = await post_service.edit_post(db, post_id, user.id, post_update)
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc

    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    is_current_user_liked = await like_repository.is_post_liked_by_user(db, post.id, user.id)
    return PostPublic(
        **post.model_dump(),
        author_username=user.username,
        is_current_user_liked=is_current_user_liked,
    )


@router.post(
    "/posts/{post_id}/comments",
    response_model=CommentPublic,
    status_code=status.HTTP_201_CREATED,
)
async def add_comment(
    post_id: str,
    comment_in: CommentCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    user: UserInDB = Depends(get_current_user),
) -> CommentPublic:
    comment = await post_service.add_comment(db, post_id, user.id, comment_in)
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return CommentPublic(**comment.model_dump(), author_username=user.username)


@router.get(
    "/posts/{post_id}/comments",
    response_model=list[CommentPublic],
    status_code=status.HTTP_200_OK,
)
async def list_comments(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    user: UserInDB = Depends(get_current_user),
) -> list[CommentPublic]:
    comments = await post_service.get_comments_for_post(db, post_id)
    if comments is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return comments


@router.post("/posts/{post_id}/likes", response_model=LikePublic, status_code=status.HTTP_201_CREATED)
async def like_post(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    user: UserInDB = Depends(get_current_user),
) -> LikePublic:
    like = await post_service.like_post(db, post_id, user.id)
    if not like:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return LikePublic(**like.model_dump())


@router.delete("/posts/{post_id}/likes", status_code=status.HTTP_204_NO_CONTENT)
async def unlike_post(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    user: UserInDB = Depends(get_current_user),
) -> None:
    deleted = await post_service.unlike_post(db, post_id, user.id)
    if deleted is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return None
