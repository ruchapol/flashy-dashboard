import app.repositories.user_repository as user_repository
from app.db.mongo import mongo_client_manager


async def count_users_and_print() -> None:
    db = mongo_client_manager.get_database()
    user_count = await user_repository.count_users(db)
    print("user count:", user_count)

