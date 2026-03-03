from functools import lru_cache
from typing import Annotated

from pydantic import AnyUrl, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Flashy Dashboard API"
    mongo_uri: Annotated[AnyUrl, Field(alias="MONGO_URI")] = "mongodb://localhost:27017"
    mongo_db_name: str = "flashy_dashboard"

    jwt_secret_key: str = "CHANGE_ME_IN_PRODUCTION"
    jwt_algorithm: str = "HS256"
    access_token_expires_minutes: int = 60 * 24

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        env_prefix = "FLASHY_"


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[arg-type]

