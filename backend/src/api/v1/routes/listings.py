"""
Route handlers for listing-related API endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from src.api.v1.controllers.listings_controller import (
    ListingsControllerError,
    get_listings,
)
from src.schemas.listing_schemas import ListingResponse

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("/", response_model=ListingResponse)
def list_listings(
    country: str = Query(..., description="Country name, e.g. 'Canada'"),
    province: str = Query(..., description="Province or state name, e.g. 'Montreal'"),
    dataset: str = Query("listings", description="Dataset filename (without .csv)"),
):
    """
    Return cleaned listing data for the requested country/province.
    """
    try:
        response = get_listings(country=country, province=province, dataset=dataset)
    except ListingsControllerError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return response
