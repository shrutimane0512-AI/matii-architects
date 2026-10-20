"""Database access: Postgres when DATABASE_URL is set (production), SQLite otherwise (local dev)."""
import sqlite3
from contextlib import contextmanager
from typing import Iterator

from app.core.config import settings

SQLITE_SCHEMA = """
CREATE TABLE IF NOT EXISTS contact_messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    message     TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
"""

POSTGRES_SCHEMA = """
CREATE TABLE IF NOT EXISTS contact_messages (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    message     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
"""

_schema_ready = False


def is_postgres() -> bool:
    return bool(settings.database_url)


def _connect():
    if is_postgres():
        import psycopg  # only needed in production

        return psycopg.connect(settings.database_url)
    return sqlite3.connect(settings.database_path)


@contextmanager
def get_connection() -> Iterator:
    global _schema_ready
    conn = _connect()
    try:
        # Serverless functions may skip app startup hooks, so create the table lazily
        if not _schema_ready:
            if is_postgres():
                conn.execute(POSTGRES_SCHEMA)
            else:
                conn.executescript(SQLITE_SCHEMA)
            _schema_ready = True
        yield conn
        conn.commit()
    finally:
        conn.close()
