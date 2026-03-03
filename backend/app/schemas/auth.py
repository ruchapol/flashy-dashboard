from datetime import datetime, timedelta

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    exp: datetime


def create_expiry(minutes: int) -> datetime:
    return datetime.utcnow() + timedelta(minutes=minutes)

