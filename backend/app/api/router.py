from fastapi import APIRouter

from app.api.routes import contact, projects, services

api_router = APIRouter()
api_router.include_router(projects.router)
api_router.include_router(services.router)
api_router.include_router(contact.router)


@api_router.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
