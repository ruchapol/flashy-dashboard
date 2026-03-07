## Feature development guide

This file is your **command file** when adding a new feature (e.g., `Bookmark`, `Notification`). Follow the same pattern for every feature so backend and frontend stay consistent.

---

### Backend feature steps (FastAPI + MongoDB)

1. **Define Pydantic schemas**

   ```python
   # backend/app/schemas/bookmark.py
   from pydantic import BaseModel
   from typing import Optional


   class BookmarkCreate(BaseModel):
       post_id: str


   class BookmarkInDB(BaseModel):
       id: str
       user_id: str
       post_id: str
   ```

2. **Create repository**

   ```python
   # backend/app/repositories/bookmark_repository.py
   from typing import List, Optional
   from app.schemas.bookmark import BookmarkInDB
   from app.db.mongo import get_collection


   collection = get_collection("bookmarks")


   async def create_bookmark(user_id: str, post_id: str) -> BookmarkInDB:
       doc = {"user_id": user_id, "post_id": post_id}
       result = await collection.insert_one(doc)
       doc["id"] = str(result.inserted_id)
       return BookmarkInDB(**doc)


   async def list_bookmarks_for_user(user_id: str) -> List[BookmarkInDB]:
       cursor = collection.find({"user_id": user_id})
       items: list[BookmarkInDB] = []
       async for doc in cursor:
           doc["id"] = str(doc["_id"])
           items.append(BookmarkInDB(**doc))
       return items
   ```

3. **Add service/logic (optional)**

   ```python
   # backend/app/services/bookmark_service.py
   from typing import List
   from app.repositories.bookmark_repository import (
       create_bookmark,
       list_bookmarks_for_user,
   )
   from app.schemas.bookmark import BookmarkInDB


   async def add_bookmark_for_user(user_id: str, post_id: str) -> BookmarkInDB:
       return await create_bookmark(user_id=user_id, post_id=post_id)


   async def get_user_bookmarks(user_id: str) -> List[BookmarkInDB]:
       return await list_bookmarks_for_user(user_id=user_id)
   ```

4. **Create API router**

   ```python
   # backend/app/api/bookmarks.py
   from typing import List
   from fastapi import APIRouter, Depends

   from app.schemas.bookmark import BookmarkCreate, BookmarkInDB
   from app.services.bookmark_service import (
       add_bookmark_for_user,
       get_user_bookmarks,
   )
   from app.dependencies.auth import get_current_user


   router = APIRouter(tags=["bookmarks"])


   @router.post("/bookmarks", response_model=BookmarkInDB)
   async def create_bookmark_endpoint(
       payload: BookmarkCreate,
       current_user=Depends(get_current_user),
   ):
       return await add_bookmark_for_user(
           user_id=str(current_user.id), post_id=payload.post_id
       )


   @router.get("/bookmarks", response_model=list[BookmarkInDB])
   async def list_bookmarks_endpoint(current_user=Depends(get_current_user)):
       return await get_user_bookmarks(user_id=str(current_user.id))
   ```

   And in `backend/app/main.py`, include the router once:

   ```python
   from fastapi import FastAPI
   from app.api import bookmarks


   app = FastAPI()
   app.include_router(bookmarks.router)
   ```

5. **Seed + docs (optional)**

   - Update `seed-data.json` and `backend/app/seed_db.py` if the feature needs initial data.
   - Add or update README/docs describing the new endpoints.

---

### Scheduler / batch job steps (APScheduler)

Use this pattern for cron-like tasks (ETL, cleanup, reporting). **Keep the scheduler entrypoint thin**: it should only start the scheduler and call **service-layer** functions. Do **not** query MongoDB directly from `main_schedule.py`.

1. **Add a repository function (DB access only)**

   ```python
   # backend/app/repositories/user_repository.py
   from motor.motor_asyncio import AsyncIOMotorDatabase


   async def count_users(db: AsyncIOMotorDatabase) -> int:
       user_collection = db["users"]
       return await user_collection.count_documents({})
   ```

2. **Add a service function (orchestrates repositories)**

   ```python
   # backend/app/services/user_service.py
   import app.repositories.user_repository as user_repository
   from app.db.mongo import mongo_client_manager


   async def count_users_and_print() -> None:
       db = mongo_client_manager.get_database()
       user_count = await user_repository.count_users(db)
       print("user count:", user_count)
   ```

3. **Create a scheduler entrypoint (no DB access here)**

   - If your job function is `async def ...`: use `AsyncIOScheduler`
   - If your job function is sync `def ...`: use `BackgroundScheduler`

   ```python
   # backend/app/main_schedule.py
   import asyncio

   from apscheduler.schedulers.asyncio import AsyncIOScheduler

   from app.services.user_service import count_users_and_print


   async def main() -> None:
       scheduler = AsyncIOScheduler()
       scheduler.add_job(count_users_and_print, "interval", minutes=1)
       scheduler.start()

       await asyncio.Event().wait()


   if __name__ == "__main__":
       asyncio.run(main())
   ```

4. **Install dependency + run**

   - Add `APScheduler` to `backend/requirements.txt`
   - Run the scheduler from an activated venv:

   ```powershell
   .\.venv\Scripts\Activate.ps1
   pip install -r backend/requirements.txt
   python backend/app/main_schedule.py
   ```

---

### Frontend feature steps (Vue + TS)

1. **Define types**

   ```ts
   // frontend/src/features/bookmarks/types.ts
   export interface Bookmark {
     id: string;
     userId: string;
     postId: string;
   }

   export interface CreateBookmarkPayload {
     postId: string;
   }
   ```

2. **Create API client**

   ```ts
   // frontend/src/features/bookmarks/api/bookmarks.ts
   import { httpClient } from "@/shared/httpClient";
   import type { Bookmark, CreateBookmarkPayload } from "../types";

   export async function createBookmark(
     payload: CreateBookmarkPayload,
   ): Promise<Bookmark> {
     const { data } = await httpClient.post<Bookmark>("/bookmarks", payload);
     return data;
   }

   export async function fetchBookmarks(): Promise<Bookmark[]> {
     const { data } = await httpClient.get<Bookmark[]>("/bookmarks");
     return data;
   }
   ```

3. **Add store/composable**

   ```ts
   // frontend/src/features/bookmarks/stores/useBookmarksStore.ts
   import { defineStore } from "pinia";
   import type { Bookmark } from "../types";
   import { createBookmark, fetchBookmarks } from "../api/bookmarks";

   interface State {
     items: Bookmark[];
     loading: boolean;
   }

   export const useBookmarksStore = defineStore("bookmarks", {
     state: (): State => ({
       items: [],
       loading: false,
     }),
     actions: {
       async load() {
         this.loading = true;
         try {
           this.items = await fetchBookmarks();
         } finally {
           this.loading = false;
         }
       },
       async add(postId: string) {
         const created = await createBookmark({ postId });
         this.items.push(created);
       },
     },
   });
   ```

4. **Build UI component**

   ```vue
   <!-- frontend/src/features/bookmarks/components/BookmarkButton.vue -->
   <script setup lang="ts">
   import { computed } from "vue";
   import { useBookmarksStore } from "../stores/useBookmarksStore";

   const props = defineProps<{
     postId: string;
   }>();

   const store = useBookmarksStore();

   const isBookmarked = computed(() =>
     store.items.some((b) => b.postId === props.postId),
   );

   const toggle = async () => {
     if (!isBookmarked.value) {
       await store.add(props.postId);
     }
     // (Unbookmark behaviour could be added later.)
   };
   </script>

   <template>
     <button type="button" @click="toggle">
       <span v-if="isBookmarked">Bookmarked</span>
       <span v-else>Bookmark</span>
     </button>
   </template>
   ```

5. **Wire into views/routes**

   - Use `BookmarkButton` inside the relevant post/timeline components.
   - If the feature has its own page (e.g. “My Bookmarks”), add a new route in `frontend/src/router` and a corresponding view under `frontend/src/views` or `frontend/src/features/bookmarks/`.

---

### Quick checklist (no examples)

**Backend**
- Define Pydantic schemas for requests/responses.
- Create/extend repository module for MongoDB access.
- Add optional service module for business logic.
- Create router module and include it in `app.main`.
- Update seed data and docs if needed.

**Frontend**
- Define TS types for the feature.
- Create API client module under `frontend/src/features/<feature>/api/`.
- Add Pinia store/composables if the feature has state.
- Build feature components and hook them into existing shared components.
- Wire up routes/views and test end-to-end.

