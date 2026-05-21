from fastapi import APIRouter
from app.schemas import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Check the operational status of the TrustLayer AI backend.
    """
    return HealthResponse(
        status="ok",
        service="TrustLayer AI Backend"
    )
