from fastapi import APIRouter, status

from app.models.schemas import ContactRequest, ContactResponse
from app.repositories import contact

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(payload: ContactRequest):
    message_id = contact.create_message(payload)
    return ContactResponse(id=message_id, detail="Thank you! We will get back to you soon.")
