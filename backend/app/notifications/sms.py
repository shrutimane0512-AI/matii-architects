"""SMS notifications via Twilio or Fast2SMS (India). Uses only the standard library."""
import base64
import json
import re
import urllib.parse
import urllib.request

from app.core.config import settings
from app.models.schemas import ContactRequest

TIMEOUT_SECONDS = 10
MAX_LENGTH = 300  # keep texts to a couple of SMS segments


def is_configured() -> bool:
    if not settings.notify_sms_to:
        return False
    if settings.sms_provider == "fast2sms":
        return bool(settings.fast2sms_api_key)
    return bool(settings.twilio_account_sid and settings.twilio_auth_token and settings.twilio_from)


def build_contact_sms(payload: ContactRequest) -> str:
    text = (
        f"Matii website enquiry from {payload.name} "
        f"({payload.phone or payload.email}): {' '.join(payload.message.split())}"
    )
    return text if len(text) <= MAX_LENGTH else text[: MAX_LENGTH - 1] + "…"


def _post(request: urllib.request.Request) -> dict:
    with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as res:
        return json.loads(res.read().decode() or "{}")


def _send_twilio(body: str) -> None:
    sid = settings.twilio_account_sid
    url = f"https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json"
    data = urllib.parse.urlencode({"To": settings.notify_sms_to, "From": settings.twilio_from, "Body": body})
    token = base64.b64encode(f"{sid}:{settings.twilio_auth_token}".encode()).decode()
    request = urllib.request.Request(url, data=data.encode(), headers={"Authorization": f"Basic {token}"})
    _post(request)


def _send_fast2sms(body: str) -> None:
    # Fast2SMS wants the 10-digit Indian number without +91
    number = re.sub(r"\D", "", settings.notify_sms_to)[-10:]
    data = json.dumps({"route": "q", "message": body, "numbers": number, "flash": 0})
    request = urllib.request.Request(
        "https://www.fast2sms.com/dev/bulkV2",
        data=data.encode(),
        headers={"authorization": settings.fast2sms_api_key, "Content-Type": "application/json"},
    )
    result = _post(request)
    if not result.get("return"):
        raise RuntimeError(f"Fast2SMS rejected the message: {result.get('message')}")


def send_contact_sms(payload: ContactRequest) -> None:
    body = build_contact_sms(payload)
    if settings.sms_provider == "fast2sms":
        _send_fast2sms(body)
    else:
        _send_twilio(body)
