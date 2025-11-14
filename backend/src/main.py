from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.v1.routes.analytics import router as analytics_router
from src.api.v1.routes.listings import router as listings_router

# Create FastAPI app
app = FastAPI(
    title="Airbnb Analytics API",
    description="API for Airbnb market analytics and insights",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(listings_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Airbnb Analytics API",
        "version": "1.0.0",
        "status": "running",
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

