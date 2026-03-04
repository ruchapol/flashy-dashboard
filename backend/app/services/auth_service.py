from datetime import datetime, timezone

from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorDatabase
from passlib.context import CryptContext

from app.core.config import get_settings
import app.repositories.user_repository as user_repository
from app.schemas.auth import Token, TokenPayload, create_expiry
from app.schemas.user import UserCreate, UserInDB


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


async def register_user(db: AsyncIOMotorDatabase, user_in: UserCreate) -> UserInDB:
    existing = await user_repository.get_user_by_email(db, user_in.email)
    if existing:
        raise ValueError("Email already registered")
    password_hash = hash_password(user_in.password)
    return await user_repository.create_user(db, user_in, password_hash=password_hash)


async def authenticate_user(
    db: AsyncIOMotorDatabase,
    email: str,
    password: str,
) -> UserInDB | None:
    user_auth = await user_repository.get_user_auth_by_email(db, email)
    if not user_auth:
        return None
    if not verify_password(password, user_auth.password_hash):
        return None
    return UserInDB(
        id=user_auth.id,
        username=user_auth.username,
        email=user_auth.email,
        role=user_auth.role,
        created_at=user_auth.created_at,
    )


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

    now = datetime.now(timezone.utc)
    exp = payload.exp
    if exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    if exp < now:
        return None

    return await user_repository.get_user_by_id(db, payload.sub)

