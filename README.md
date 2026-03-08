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

## Deployment (Jenkins -> FE/BE "servers" over SSH)

This repo supports a deployment approach where:

- Jenkins builds FE/BE Docker images, saves them as `.tar`, and transfers them to each server (SCP/rsync).
- Each server runs `docker compose up -d` locally to run/restart containers.

In local/dev, the "servers" can be simulated as **two SSH host containers** (`be-host` and `fe-host`) started by `deployment/docker-compose.yml`.

### Provision FE/BE host containers (Linux)

#### 1) Start the FE/BE host containers

From the repo root:

```bash
docker compose -f deployment/docker-compose.yml up -d --build be-host fe-host
```

These containers expose SSH on:

- BE host: `localhost:2224`
- FE host: `localhost:2225`

#### 2) Register your SSH public key on both hosts (so Jenkins can SSH without password)

```bash
ssh-copy-id -p 2224 -i ~/.ssh/id_rsa.pub jenkins@localhost
ssh-copy-id -p 2225 -i ~/.ssh/id_rsa.pub jenkins@localhost
```

#### 3) Prepare Jenkins SSH key path on the Jenkins machine

The pipeline expects the private key to exist at `/var/lib/jenkins/ssh_key/id_rsa`.

```bash
sudo mkdir -p /var/lib/jenkins/ssh_key
sudo cp ~/.ssh/id_rsa /var/lib/jenkins/ssh_key/id_rsa
sudo chown -R jenkins:jenkins /var/lib/jenkins/ssh_key
sudo chmod 700 /var/lib/jenkins/ssh_key
sudo chmod 600 /var/lib/jenkins/ssh_key/id_rsa
```

#### 4) Create deployment folders on each host

The pipeline deploys to:

- BE: `/home/jenkins/flashy/backend`
- FE: `/home/jenkins/flashy/frontend`

Create them on both hosts:

```bash
ssh -p 2224 jenkins@localhost "mkdir -p /home/jenkins/flashy/backend"
ssh -p 2225 jenkins@localhost "mkdir -p /home/jenkins/flashy/frontend"
```

## Next steps

- Implement core backend entities and API routes (`User`, `Post`, `Comment`, `Like`) based on `db-schema.md` and `tasks.md`.
- Wire the frontend screens to those APIs (timeline feed, create equation flow, auth, comments, likes).

## Feature checklist (backend + frontend)

For a detailed, example-driven guide to adding new features (including backend and frontend code samples), see `FEATURE-GUIDE.md` in the repo root.

