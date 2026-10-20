"""Interactive setup for contact-form email + SMS notifications.

Run from the backend folder:
    .venv/bin/python scripts/setup_notifications.py

It saves your settings to backend/.env, sends a real test email and SMS,
and can copy the settings to your linked Vercel project.
"""
import getpass
import os
import re
import shutil
import smtplib
import subprocess
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
REPO_DIR = BACKEND_DIR.parent
ENV_FILE = BACKEND_DIR / ".env"
sys.path.insert(0, str(BACKEND_DIR))


# ---------- .env helpers ----------
def read_env() -> dict:
    values = {}
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            m = re.match(r"^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$", line)
            if m:
                values[m.group(1)] = m.group(2)
    return values


def write_env(updates: dict) -> None:
    """Update keys in place, append new ones, keep everything else untouched."""
    lines = ENV_FILE.read_text().splitlines() if ENV_FILE.exists() else []
    remaining = dict(updates)
    for i, line in enumerate(lines):
        m = re.match(r"^\s*([A-Z0-9_]+)\s*=", line)
        if m and m.group(1) in remaining:
            lines[i] = f"{m.group(1)}={remaining.pop(m.group(1))}"
    lines += [f"{k}={v}" for k, v in remaining.items()]
    ENV_FILE.write_text("\n".join(lines) + "\n")


# ---------- prompts ----------
def ask(label: str, default: str = "", secret: bool = False) -> str:
    if secret:
        hint = " (press Enter to keep the saved one)" if default else ""
        value = getpass.getpass(f"{label}{hint}: ").strip()
    else:
        value = input(f"{label}" + (f" [{default}]" if default else "") + ": ").strip()
    return value or default


def yes(question: str, default: bool = True) -> bool:
    answer = input(f"{question} [{'Y/n' if default else 'y/N'}]: ").strip().lower()
    return default if not answer else answer.startswith("y")


def heading(text: str) -> None:
    print(f"\n=== {text} ===")


# ---------- steps ----------
def configure(env: dict) -> dict:
    updates = {}

    heading("Email (Gmail SMTP)")
    print("You need a Gmail App Password: https://myaccount.google.com/apppasswords")
    print("(2-Step Verification must be on for that Google account.)")
    updates["CONTACT_NOTIFY_EMAIL"] = ask("Send enquiries to", env.get("CONTACT_NOTIFY_EMAIL", ""))
    updates["SMTP_USER"] = ask("Gmail address that sends the email", env.get("SMTP_USER", ""))
    password = ask("Gmail App Password (16 letters)", env.get("SMTP_PASSWORD", ""), secret=True)
    updates["SMTP_PASSWORD"] = password.replace(" ", "")  # Google shows it in groups of 4
    updates["SMTP_HOST"] = env.get("SMTP_HOST") or "smtp.gmail.com"
    updates["SMTP_PORT"] = env.get("SMTP_PORT") or "587"

    heading("Text message (SMS)")
    updates["CONTACT_NOTIFY_PHONE"] = ask("Send texts to (international format)", env.get("CONTACT_NOTIFY_PHONE", ""))
    provider = ask("SMS provider: twilio or fast2sms", env.get("SMS_PROVIDER", "twilio")).lower()
    updates["SMS_PROVIDER"] = provider
    if provider == "fast2sms":
        print("Find your API key at https://www.fast2sms.com/dashboard/dev-api")
        updates["FAST2SMS_API_KEY"] = ask("Fast2SMS API key", env.get("FAST2SMS_API_KEY", ""), secret=True)
    else:
        print("Find these on https://console.twilio.com (Account Info). On a trial account, first verify")
        print(f"{updates['CONTACT_NOTIFY_PHONE'] or 'the phone number'} under Phone Numbers > Verified Caller IDs.")
        updates["TWILIO_ACCOUNT_SID"] = ask("Twilio Account SID", env.get("TWILIO_ACCOUNT_SID", ""))
        updates["TWILIO_AUTH_TOKEN"] = ask("Twilio Auth Token", env.get("TWILIO_AUTH_TOKEN", ""), secret=True)
        updates["TWILIO_FROM"] = ask("Your Twilio phone number (e.g. +15551234567)", env.get("TWILIO_FROM", ""))

    write_env(updates)
    print(f"\nSaved to {ENV_FILE}")
    return updates


def send_tests() -> None:
    heading("Sending test notifications")
    from app.models.schemas import ContactRequest
    from app.notifications import mailer, sms

    payload = ContactRequest(
        name="Website test",
        email=os.environ.get("SMTP_USER", "test@example.com"),
        message="This is a test enquiry from the Matii Architects notification setup.",
    )

    if not mailer.is_configured():
        print("Email: skipped (settings incomplete)")
    else:
        try:
            mailer.send_contact_email(payload)
            print("Email: sent ✓  (check the inbox, and the Spam folder the first time)")
        except smtplib.SMTPAuthenticationError:
            print("Email: FAILED — Gmail rejected the login. Use an App Password, not your normal password.")
        except Exception as exc:
            print(f"Email: FAILED — {exc}")

    if not sms.is_configured():
        print("SMS:   skipped (settings incomplete)")
    else:
        try:
            sms.send_contact_sms(payload)
            print("SMS:   sent ✓")
        except Exception as exc:
            print(f"SMS:   FAILED — {exc}")


def push_to_vercel(keys) -> None:
    heading("Vercel")
    if not (REPO_DIR / ".vercel" / "project.json").exists():
        print("This folder is not linked to a Vercel project. Run `npx vercel link` first,")
        print("or add the variables in Vercel > Project > Settings > Environment Variables.")
        return
    if not shutil.which("npx"):
        print("npx not found; add the variables in the Vercel dashboard instead.")
        return
    if not yes("Copy these settings to your Vercel project (production)?"):
        return

    env = read_env()
    for key in keys:
        value = env.get(key, "")
        if not value:
            continue
        # Replace any existing value, then add the new one (value goes in via stdin, not the command line)
        subprocess.run(["npx", "vercel", "env", "rm", key, "production", "--yes"],
                       cwd=REPO_DIR, capture_output=True, text=True)
        result = subprocess.run(["npx", "vercel", "env", "add", key, "production"],
                                cwd=REPO_DIR, input=value, capture_output=True, text=True)
        print(f"{key}: {'saved ✓' if result.returncode == 0 else 'FAILED — ' + (result.stderr.strip() or result.stdout.strip())}")
    print("\nRedeploy so the site picks them up:  npx vercel --prod")


def main() -> None:
    print("Matii Architects — contact form notification setup")
    updates = configure(read_env())

    # Load the new settings into this process before importing the app
    for key, value in read_env().items():
        os.environ[key] = value

    if yes("\nSend a test email and SMS now?"):
        send_tests()
    push_to_vercel(updates.keys())


if __name__ == "__main__":
    try:
        main()
    except (KeyboardInterrupt, EOFError):
        print("\nCancelled.")
