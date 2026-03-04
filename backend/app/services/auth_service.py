from datetime import datetime

from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import get_settings
import app.repositories.user_repository as user_repository
from app.schemas.auth import Token, TokenPayload, create_expiry
from app.schemas.user import UserCreate, UserInDB


async def register_user(db: AsyncIOMotorDatabase, user_in: UserCreate) -> UserInDB:
    existing = await user_repository.get_user_by_email(db, user_in.email)
    if existing:
        raise ValueError("Email already registered")
    return await user_repository.create_user(db, user_in)


async def authenticate_user(
    db: AsyncIOMotorDatabase,
    email: str,
    password: str,
) -> UserInDB | None:
    return await user_repository.verify_user_credentials(db, email, password)


def create_access_token(user: UserInDB) -> Token:
    settings = get_settings()
    expire = create_expiry(settings.access_token_expires_minutes)
    payload = {"sub": user.id, "exp": expire}
    encoded = jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return Token(access_token=encoded)


async def get_user_from_token(db: AsyncIOMotorDatabase, token: str) -> UserInDB | None:
    settings = get_settings()
    try:
        decoded = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        payload = TokenPayload(**decoded)
    except (JWTError, ValueError):
        return None

    if payload.exp < datetime.utcnow():
        return None

    return await user_repository.get_user_by_id(db, payload.sub)

