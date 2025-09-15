from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from api import listings, analytics, search, market_data


# Create FastAPI app
app = FastAPI(
    title="Airbnb Analytics API",
    description="API for Airbnb market analytics and insights",
    version="1.0.0"
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
# app.include_router(listings.router, prefix="/api/listings", tags=["listings"])
# app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
# app.include_router(search.router, prefix="/api/search", tags=["search"])
# app.include_router(market_data.router, prefix="/api/market-data", tags=["market-data"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Airbnb Analytics API",
        "version": "1.0.0",
        "status": "running"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

