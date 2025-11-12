"""
Route handlers for listing-related API endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from src.api.v1.controllers.listings_controller import (
    ListingsControllerError,
    get_listings,
)
from src.data_access.registry import RegistryError, list_countries, list_provinces
from src.schemas.listing_schemas import (
    CountryListResponse,
    ListingResponse,
    ProvinceListResponse,
)

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


@router.get("/countries", response_model=CountryListResponse)
def get_countries():
    """Return the list of countries that have datasets available."""
    countries = list_countries()
    if not countries:
        raise HTTPException(status_code=404, detail="No countries found in data directory.")
    return CountryListResponse(countries=countries)


@router.get("/provinces", response_model=ProvinceListResponse)
def get_provinces(country: str = Query(..., description="Country name to list provinces for")):
    """Return provinces/states available for the given country."""
    try:
        provinces = list_provinces(country)
    except RegistryError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    if not provinces:
        raise HTTPException(status_code=404, detail=f"No provinces found for '{country}'.")

    return ProvinceListResponse(country=country, provinces=provinces)
