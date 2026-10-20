import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[2]
APP_DIR = BACKEND_DIR / "app"

load_dotenv(BACKEND_DIR / ".env")

# Vercel's filesystem is read-only except /tmp (and /tmp is wiped between invocations)
_default_sqlite = "/tmp/matii.db" if os.getenv("VERCEL") else "matii.db"


class Settings:
    app_name: str = "Matii Architects API"
    api_prefix: str = "/api"
    data_dir: Path = APP_DIR / "data"
    # Postgres (e.g. Neon via Vercel Storage) when set; otherwise a local SQLite file
    database_url = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL")
    database_path: Path = BACKEND_DIR / os.getenv("DATABASE_PATH", _default_sqlite)
    cors_origins = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ]


settings = Settings()
