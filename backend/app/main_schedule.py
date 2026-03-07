"""Scheduler service. Run with: uvicorn app.main_schedule:app --host 0.0.0.0 --port 8000"""
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI

from app.core.config import get_settings
from app.db.mongo import mongo_client_manager
from app.services.user_service import count_users_and_print


@asynccontextmanager
async def lifespan(app: FastAPI):
    _ = app
    mongo_client_manager.get_database()

    scheduler = AsyncIOScheduler()
    scheduler.add_job(count_users_and_print, "interval", minutes=1)
    scheduler.start()

    try:
        yield
    finally:
        scheduler.shutdown(wait=False)
        await mongo_client_manager.close()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=f"{settings.app_name} (scheduler)", lifespan=lifespan)
    return app


app = create_app()
