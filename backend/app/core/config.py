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

    # Contact form notifications (all optional; a channel is skipped when not configured)
    notify_email = os.getenv("CONTACT_NOTIFY_EMAIL")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM") or os.getenv("SMTP_USER")

    notify_sms_to = os.getenv("CONTACT_NOTIFY_PHONE")  # e.g. +919876543210
    sms_provider = os.getenv("SMS_PROVIDER", "twilio").lower()  # twilio | fast2sms
    twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    twilio_from = os.getenv("TWILIO_FROM")  # your Twilio phone number
    fast2sms_api_key = os.getenv("FAST2SMS_API_KEY")

    cors_origins = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ]


settings = Settings()
