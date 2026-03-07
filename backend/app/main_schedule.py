import asyncio

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.services.user_service import count_users_and_print


async def main() -> None:
    scheduler = AsyncIOScheduler()
    scheduler.add_job(count_users_and_print, "interval", minutes=1)
    scheduler.start()

    try:
        # Keep the scheduler (and process) running without manual sleep loops.
        await asyncio.Event().wait()
    finally:
        scheduler.shutdown()


if __name__ == "__main__":
    asyncio.run(main())
