"""Read-only site content (projects, services) stored as JSON files."""
import json
from functools import lru_cache
from typing import List, Optional

from app.core.config import settings
from app.models.schemas import Project, Service


@lru_cache
def _load(filename: str) -> list:
    with open(settings.data_dir / filename, encoding="utf-8") as f:
        return json.load(f)


def list_projects(category: Optional[str] = None) -> List[Project]:
    projects = [Project(**p) for p in _load("projects.json")]
    if category:
        projects = [p for p in projects if p.category.lower() == category.lower()]
    return projects


def get_project(slug: str) -> Optional[Project]:
    return next((p for p in list_projects() if p.slug == slug), None)


def list_services() -> List[Service]:
    return [Service(**s) for s in _load("services.json")]
