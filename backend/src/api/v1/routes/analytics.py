"""
Route handlers for analytics-related API endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from src.api.v1.controllers.analytics_controller import (
    AnalyticsControllerError,
    get_analytics,
)
from src.schemas.listing_schemas import AnalyticsResponse

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/", response_model=AnalyticsResponse)
def get_listings_analytics(
    country: str = Query(..., description="Country name, e.g. 'Canada'"),
    province: str = Query(
        None,
        description="Optional province/state name. If omitted, aggregates all provinces in the country.",
    ),
    dataset: str = Query("listings", description="Dataset filename (without .csv)"),
):
    """
    Return analytics (charts data) for the requested country/province.
    
    If province is provided, analyzes only that province's data.
    If province is omitted, aggregates data from all provinces in the country.
    
    Returns distributions for:
    - Property types
    - Room types
    - Amenities (top 20)
    - Price statistics (average, highest, lowest, median)
    - Review statistics (total, average, max, min)
    - Instant booking stats (enabled vs disabled)
    """
    try:
        response = get_analytics(country=country, province=province, dataset=dataset)
    except AnalyticsControllerError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return response

