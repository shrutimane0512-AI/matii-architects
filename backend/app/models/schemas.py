from typing import List, Optional

from pydantic import BaseModel, Field


class Project(BaseModel):
    id: int
    slug: str
    title: str
    category: str
    location: str
    year: int
    summary: str
    tone: str = Field(description="Palette tone used by the frontend card: sage | terracotta | stone")


class Service(BaseModel):
    id: int
    title: str
    description: str
    highlights: List[str] = []


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$", max_length=254)
    phone: Optional[str] = Field(default=None, max_length=20)
    message: str = Field(min_length=10, max_length=2000)


class ContactResponse(BaseModel):
    id: int
    detail: str
