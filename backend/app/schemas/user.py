from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


Role = Literal["user", "admin"]


class UserBase(BaseModel):
    username: str = Field(min_length=3, max_length=32)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserInDB(UserBase):
    id: str
    role: Role = "user"
    created_at: datetime


class UserPublic(UserBase):
    id: str
    role: Role
    created_at: datetime

