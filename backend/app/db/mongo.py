from collections.abc import AsyncGenerator

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import get_settings


class MongoClientManager:
    def __init__(self) -> None:
        self._client: AsyncIOMotorClient | None = None

    def get_client(self) -> AsyncIOMotorClient:
        if self._client is None:
            settings = get_settings()
            self._client = AsyncIOMotorClient(str(settings.mongo_uri))
        return self._client

    def get_database(self) -> AsyncIOMotorDatabase:
        settings = get_settings()
        return self.get_client()[settings.mongo_db_name]

    async def close(self) -> None:
        if self._client is not None:
            self._client.close()
            self._client = None


mongo_client_manager = MongoClientManager()


async def get_database() -> AsyncGenerator[AsyncIOMotorDatabase, None]:
    yield mongo_client_manager.get_database()

