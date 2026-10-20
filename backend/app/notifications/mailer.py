"""Email notifications over SMTP (e.g. Gmail with an app password)."""
import smtplib
import ssl
from email.message import EmailMessage

from app.core.config import settings
from app.models.schemas import ContactRequest

TIMEOUT_SECONDS = 10


def is_configured() -> bool:
    return bool(settings.notify_email and settings.smtp_user and settings.smtp_password)


def _one_line(value: str) -> str:
    # Header values must not contain line breaks
    return " ".join(value.split())


def build_contact_email(payload: ContactRequest) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = f"New enquiry from {_one_line(payload.name)} — Matii Architects website"
    msg["From"] = f"Matii Architects Website <{settings.smtp_from}>"
    msg["To"] = settings.notify_email
    msg["Reply-To"] = payload.email  # hitting Reply answers the visitor directly
    msg.set_content(
        "You have a new message from the website contact form.\n\n"
        f"Name:    {payload.name}\n"
        f"Email:   {payload.email}\n"
        f"Phone:   {payload.phone or '-'}\n\n"
        f"Message:\n{payload.message}\n"
    )
    return msg


def send_contact_email(payload: ContactRequest) -> None:
    msg = build_contact_email(payload)
    context = ssl.create_default_context()
    if settings.smtp_port == 465:
        with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=TIMEOUT_SECONDS, context=context) as smtp:
            smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(msg)
    else:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=TIMEOUT_SECONDS) as smtp:
            smtp.starttls(context=context)
            smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(msg)
