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

