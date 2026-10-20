from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


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

    @field_validator("name", "email", "phone", mode="before")
    @classmethod
    def single_line(cls, value):
        # Collapse line breaks/extra spaces in one-line fields (they end up in email headers and SMS)
        return " ".join(value.split()) if isinstance(value, str) else value


class ContactResponse(BaseModel):
    id: Optional[int] = None
    detail: str
