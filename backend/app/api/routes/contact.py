import logging

from fastapi import APIRouter, HTTPException, status

from app.models.schemas import ContactRequest, ContactResponse
from app.notifications.contact import notify_new_contact
from app.repositories import contact

router = APIRouter(prefix="/contact", tags=["contact"])
logger = logging.getLogger(__name__)


@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(payload: ContactRequest):
    message_id = None
    try:
        message_id = contact.create_message(payload)
    except Exception:
        logger.exception("Could not save contact message")

    # Sent before responding: serverless functions may stop once the response is returned
    delivered = notify_new_contact(payload)

    # Succeed if the message reached us by any route (database, email or SMS)
    if message_id is None and not any(delivered.values()):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Sorry, your message could not be sent. Please email or call us directly.",
        )
    return ContactResponse(id=message_id, detail="Thank you! We will get back to you soon.")
