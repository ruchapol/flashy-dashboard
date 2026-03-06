from datetime import datetime

from pydantic import BaseModel, Field


class CommentBase(BaseModel):
    text: str = Field(min_length=1, max_length=500)


class CommentCreate(CommentBase):
    pass


class CommentInDB(CommentBase):
    id: str
    post_id: str
    author_id: str
    created_at: datetime


class CommentPublic(CommentInDB):
    author_username: str

