# Flashy Dashboard

Flashy Dashboard is a Vue.js + FastAPI + MongoDB app where users create math equations, render graphs, and share them on a social-style timeline.

## Backend (FastAPI)

- Location: `backend/`
- Environment:
  - Python virtualenv already created at `.venv`
  - Dependencies listed in `backend/requirements.txt`

### Run backend dev server

```bash
# from repo root (Windows PowerShell)
.venv\Scripts\python -m pip install -r backend/requirements.txt
cd backend
.venv\Scripts\python -m uvicorn app.main:app --reload
```

Then open `http://localhost:8000/health` to verify the API is running.

API docs:

- Swagger UI: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

MongoDB connection details, JWT settings, and timezone are configured via `backend/app/config.yml` (with optional env overrides); see `backend/app/core/config.py`.

### Run scheduler

The scheduler runs as a separate process (same uvicorn style as the API). From repo root:

```bash
cd backend
..\.venv\Scripts\Activate.ps1
uvicorn app.main_schedule:app --reload --port 8001
```

Use a different port (e.g. `8001`) if the API is already on `8000`. With Docker: `docker compose --profile scheduler up backend_scheduler`.

### Load seed data into MongoDB

You can pre-populate the database using `seed-data.json` and the backend seeding script.

```bash
# from repo root (Windows PowerShell)
cd backend
..\ .venv\Scripts\Activate.ps1
python -m app.seed_db
```

This will wipe the `users`, `posts`, `comments`, and `likes` collections and insert the data from `seed-data.json`.

## Frontend (Vue + Vite)

- Location: `frontend/`
- The Vite/Vue skeleton is handwritten to avoid network dependency issues.

### Install deps and run dev server

```bash
cd frontend
npm install
npm run dev
```

Then open the printed `http://localhost:5173` URL. You should see:

- A top bar with the **Flashy Dashboard** logo and **Create Equation** button.
- Routes for timeline (`/`), create (`/create`), post detail (`/post/:id`), login (`/login`), and register (`/register`) with placeholder content.

## Next steps

- Implement core backend entities and API routes (`User`, `Post`, `Comment`, `Like`) based on `db-schema.md` and `tasks.md`.
- Wire the frontend screens to those APIs (timeline feed, create equation flow, auth, comments, likes).

## Feature checklist (backend + frontend)

For a detailed, example-driven guide to adding new features (including backend and frontend code samples), see `FEATURE-GUIDE.md` in the repo root.

