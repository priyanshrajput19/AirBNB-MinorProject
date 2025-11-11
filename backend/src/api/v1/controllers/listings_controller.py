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
    cleaning_rules: Optional[Dict[str, Any]] = None,
) -> ListingResponse:
    """
    Load, clean, and serialise listing data for the given country/province.

    Parameters:
        country: Country requested by the frontend (case-insensitive).
        province: Province/state requested by the frontend.
        dataset: Name of the CSV dataset (default: "listings").
        cleaning_rules: Optional overrides passed to the cleaning pipeline.

    Returns:
        ListingResponse containing total count and cleaned Listing items.
    """
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

    items = _dataframe_to_listings(cleaned_df)

    return ListingResponse(
        total=len(items),
        country=country,
        province=province,
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
