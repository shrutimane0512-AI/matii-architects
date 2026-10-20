from app.db.database import get_connection, is_postgres
from app.models.schemas import ContactRequest


def create_message(payload: ContactRequest) -> int:
    params = (payload.name, payload.email, payload.phone, payload.message)
    with get_connection() as conn:
        if is_postgres():
            cur = conn.execute(
                "INSERT INTO contact_messages (name, email, phone, message) "
                "VALUES (%s, %s, %s, %s) RETURNING id",
                params,
            )
            return cur.fetchone()[0]
        cur = conn.execute(
            "INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)",
            params,
        )
        return cur.lastrowid
