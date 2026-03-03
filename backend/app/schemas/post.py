from datetime import datetime

from pydantic import BaseModel, Field


class PostBase(BaseModel):
    equation_text: str = Field(min_length=1, max_length=512)
    x_min: float
    x_max: float
    y_min: float | None = None
    y_max: float | None = None
    y_auto: bool = True
    caption: str = Field(default="", max_length=280)


class PostCreate(PostBase):
    pass


class PostInDB(PostBase):
    id: str
    author_id: str
    created_at: datetime
    like_count: int = 0
    comment_count: int = 0


class PostPublic(PostInDB):
    pass

