from typing import List

from fastapi import APIRouter

from app.models.schemas import Service
from app.repositories import content

router = APIRouter(prefix="/services", tags=["services"])


@router.get("", response_model=List[Service])
def list_services():
    return content.list_services()
