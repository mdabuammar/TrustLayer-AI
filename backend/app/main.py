from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health, upload, search, ask

# Initialize FastAPI application
app = FastAPI(
    title="TrustLayer AI Backend",
    description="Lightweight backend foundation for trust and hallucination detection.",
    version="0.1.0"
)

# CORS middleware configuration for future frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; lock down for production later
    allow_credentials=True,
    allow_methods=["*"],  # Allow all standard HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(upload.router, tags=["Upload"])
app.include_router(search.router, tags=["Search"])
app.include_router(ask.router, tags=["QA"])



@app.get("/")
async def root():
    """
    Root endpoint of TrustLayer AI Backend.
    """
    return {"message": "TrustLayer AI Backend is running"}
