## Backend – Run Instructions (Windows / PowerShell)

Run all commands from the project root: `h:\work\ptj\playground\flashy-dashboard`.

```powershell
# 1) Go to project root
cd h:\work\ptj\playground\flashy-dashboard

# 2) Create virtual environment (first time only)
python -m venv .venv

# 3) Activate virtual environment (every new shell)
.\.venv\Scripts\Activate.ps1

# 4) Install backend dependencies (after venv activation)
cd backend
pip install -r requirements.txt

# 5) Run FastAPI app
uvicorn app.main:app --reload --port 8000
```

