"""Fan out a new contact message to every configured channel (email, SMS) in parallel."""
import logging
from concurrent.futures import ThreadPoolExecutor
from typing import Dict

from app.models.schemas import ContactRequest
from app.notifications import mailer, sms

logger = logging.getLogger(__name__)

CHANNELS = {
    "email": (mailer.is_configured, mailer.send_contact_email),
    "sms": (sms.is_configured, sms.send_contact_sms),
}


def _run(name: str, send, payload: ContactRequest) -> bool:
    try:
        send(payload)
        return True
    except Exception:  # never let one channel break the form
        logger.exception("Contact notification via %s failed", name)
        return False


def notify_new_contact(payload: ContactRequest) -> Dict[str, bool]:
    """Returns {channel: delivered} for each configured channel."""
    active = {}
    for name, (is_configured, send) in CHANNELS.items():
        if is_configured():
            active[name] = send
        else:
            logger.warning("Contact notification via %s skipped: not configured", name)

    if not active:
        return {}
    with ThreadPoolExecutor(max_workers=len(active)) as pool:
        futures = {name: pool.submit(_run, name, send, payload) for name, send in active.items()}
        return {name: future.result() for name, future in futures.items()}
