from typing import List, Optional

from fastapi import APIRouter, HTTPException

from app.models.schemas import Project
from app.repositories import content

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=List[Project])
def list_projects(category: Optional[str] = None):
    return content.list_projects(category)


@router.get("/{slug}", response_model=Project)
def get_project(slug: str):
    project = content.get_project(slug)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
