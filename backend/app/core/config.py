from functools import lru_cache
from pathlib import Path
from typing import Annotated, Any

import yaml
from pydantic import AnyUrl, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str
    mongo_uri: Annotated[AnyUrl, Field(alias="MONGO_URI")]
    mongo_db_name: str

    jwt_secret_key: str
    jwt_algorithm: str
    access_token_expires_minutes: int

    app_timezone: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        env_prefix = "FLASHY_"


CONFIG_PATH = Path(__file__).resolve().parent.parent / "config.yml"


def _load_config_from_yaml() -> dict[str, Any]:
    raw = yaml.safe_load(CONFIG_PATH.read_text(encoding="utf-8")) or {}
    if not isinstance(raw, dict):
        raise ValueError("Config YAML must contain a top-level mapping")
    return raw


@lru_cache
def get_settings() -> Settings:
    data = _load_config_from_yaml()
    return Settings(**data)  # type: ignore[arg-type]

