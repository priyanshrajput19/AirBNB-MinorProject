"""
Listing controller: orchestrates loading raw CSVs, cleaning them, and returning API-ready data.
"""

from __future__ import annotations

import ast
from typing import Any, Dict, Optional

import pandas as pd

from ....data_access.loader import load_csv, LoaderError
from ....data_access.registry import RegistryError
from ....data_cleaning.cleaning_pipeline import clean_listings
from ....schemas.listing_schemas import Listing, ListingResponse


class ListingsControllerError(RuntimeError):
    """Raised when listings cannot be prepared for API consumption."""


def get_listings(
    *,
    country: str,
    province: str,
    dataset: str = "listings",
    page: int = 1,
    page_size: int = 20,
    cleaning_rules: Optional[Dict[str, Any]] = None,
    property_type: Optional[str] = None,
    room_type: Optional[str] = None,
    amenity: Optional[str] = None,
) -> ListingResponse:
    """
    Load, clean, and serialise listing data for the given country/province with pagination.

    Parameters:
        country: Country requested by the frontend (case-insensitive).
        province: Province/state requested by the frontend.
        dataset: Name of the CSV dataset (default: "listings").
        page: Page number (1-indexed, default: 1).
        page_size: Number of items per page (default: 20, max: 100).
        cleaning_rules: Optional overrides passed to the cleaning pipeline.

    Returns:
        ListingResponse containing paginated listings with metadata.
    """
    # Validate pagination parameters
    if page < 1:
        page = 1
    if page_size < 1:
        page_size = 20
    if page_size > 100:
        page_size = 100  # Cap at 100 to prevent excessive data transfer

    try:
        raw_df = load_csv(country, province, dataset)
    except (RegistryError, LoaderError) as exc:
        raise ListingsControllerError(str(exc)) from exc

    try:
        cleaned_df = clean_listings(
            raw_df,
            country=country,
            province=province,
            dataset_name=dataset,
            rules=cleaning_rules,
        )
    except ValueError as exc:
        raise ListingsControllerError(f"Cleaning failed: {exc}") from exc

    # Apply filters
    if property_type:
        # Remove "Property: " prefix if present
        filter_value = property_type.replace("Property: ", "")
        if "property_types" in cleaned_df.columns:
            cleaned_df = cleaned_df[cleaned_df["property_types"].astype(str).str.contains(filter_value, case=False, na=False)]
    
    if room_type:
        # Remove "Room: " prefix if present
        filter_value = room_type.replace("Room: ", "")
        if "room_type" in cleaned_df.columns:
            cleaned_df = cleaned_df[cleaned_df["room_type"].astype(str).str.contains(filter_value, case=False, na=False)]
    
    if amenity:
        # Filter by amenity - amenities column can be a list or string
        import ast
        if "amenities" in cleaned_df.columns:
            def has_amenity(amenities_value, search_amenity):
                if pd.isna(amenities_value):
                    return False
                
                # Try to parse as list if it's a string representation
                try:
                    if isinstance(amenities_value, str):
                        if amenities_value.strip().startswith("["):
                            amenities_list = ast.literal_eval(amenities_value)
                        else:
                            amenities_list = [a.strip() for a in amenities_value.split(",") if a.strip()]
                    elif isinstance(amenities_value, list):
                        amenities_list = amenities_value
                    else:
                        amenities_list = [str(amenities_value)]
                    
                    # Check if search amenity is in the list (case-insensitive)
                    search_lower = search_amenity.lower()
                    return any(search_lower in str(a).lower() for a in amenities_list)
                except (ValueError, SyntaxError):
                    # If parsing fails, treat as single amenity string
                    return search_amenity.lower() in str(amenities_value).lower()
            
            cleaned_df = cleaned_df[cleaned_df["amenities"].apply(lambda x: has_amenity(x, amenity))]

    # Calculate pagination
    total = len(cleaned_df)
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1  # Ceiling division
    
    # Validate page number
    if page > total_pages and total > 0:
        page = total_pages
    
    # Calculate slice indices
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    
    # Slice the dataframe for the requested page
    paginated_df = cleaned_df.iloc[start_idx:end_idx]
    items = _dataframe_to_listings(paginated_df)

    # Calculate pagination flags
    has_next = page < total_pages
    has_previous = page > 1

    return ListingResponse(
        total=total,
        country=country,
        province=province,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        has_next=has_next,
        has_previous=has_previous,
        items=items,
    )


def _dataframe_to_listings(dataframe: pd.DataFrame) -> list[Listing]:
    """Convert a pandas DataFrame into a list of Listing Pydantic models."""
    records = dataframe.to_dict(orient="records")
    cleaned_records: list[dict[str, Any]] = []
    allowed_fields = set(Listing.model_fields.keys())

    for record in records:
        normalised: dict[str, Any] = {}
        for key, value in record.items():
            if key not in allowed_fields:
                continue

            if pd.isna(value):
                normalised[key] = None
            elif key == "listing_id":
                normalised[key] = str(value)
            elif key in {"id", "host_id"}:
                normalised[key] = str(value)
            elif key == "host_identity_verified":
                if isinstance(value, str):
                    normalised[key] = value.strip().lower() in {"true", "t", "yes", "1"}
                else:
                    normalised[key] = bool(value)
            elif key == "amenities":
                if isinstance(value, str):
                    try:
                        parsed = ast.literal_eval(value)
                        normalised[key] = parsed if isinstance(parsed, list) else value
                    except (SyntaxError, ValueError):
                        normalised[key] = value
                else:
                    normalised[key] = value
            else:
                normalised[key] = value
        cleaned_records.append(normalised)

    return [Listing(**record) for record in cleaned_records]
