from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api import auth, health, posts
from app.core.config import get_settings
from app.db.mongo import mongo_client_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    _ = app  # reserved for future use
    try:
        mongo_client_manager.get_database()
        yield
    finally:
        await mongo_client_manager.close()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, lifespan=lifespan)

    app.include_router(auth.router)
    app.include_router(health.router)
    app.include_router(posts.router)

    return app


app = create_app()


