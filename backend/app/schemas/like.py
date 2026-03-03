from datetime import datetime

from pydantic import BaseModel


class LikeInDB(BaseModel):
    post_id: str
    user_id: str
    created_at: datetime


class LikePublic(LikeInDB):
    pass

