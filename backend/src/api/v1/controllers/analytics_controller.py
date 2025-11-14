"""
Analytics controller: orchestrates loading CSVs, cleaning them, and computing analytics.
"""

from __future__ import annotations

from typing import Optional

import pandas as pd

from ....data_access.loader import load_csv, LoaderError
from ....data_access.registry import list_provinces, RegistryError
from ....data_cleaning.cleaning_pipeline import clean_listings
from ....schemas.listing_schemas import (
    AnalyticsResponse,
    PropertyTypeDistribution,
    RoomTypeDistribution,
    AmenityDistribution,
    PriceStatistics,
    ReviewStatistics,
    InstantBookingStats,
)
from ....services.analytics_service import (
    analyze_property_type_distribution,
    analyze_room_type_distribution,
    analyze_amenity_distribution,
    analyze_price_statistics,
    analyze_review_statistics,
    analyze_instant_booking_stats,
)


class AnalyticsControllerError(RuntimeError):
    """Raised when analytics cannot be computed."""


def get_analytics(
    *,
    country: str,
    province: Optional[str] = None,
    dataset: str = "listings",
) -> AnalyticsResponse:
    """
    Load, clean, and compute analytics for the given country/province or entire country.
    
    If province is provided, analyzes only that province's data.
    If province is None, analyzes all provinces in the country (aggregated).
    
    Parameters:
        country: Country requested by the frontend (case-insensitive).
        province: Optional province/state. If None, aggregates all provinces in country.
        dataset: Name of the CSV dataset (default: "listings").
    
    Returns:
        AnalyticsResponse containing all computed statistics.
    """
    try:
        if province:
            # Single province analysis
            raw_df = load_csv(country, province, dataset)
            cleaned_df = clean_listings(
                raw_df,
                country=country,
                province=province,
                dataset_name=dataset,
            )
        else:
            # Aggregate all provinces in the country
            provinces = list_provinces(country)
            if not provinces:
                raise AnalyticsControllerError(f"No provinces found for country '{country}'.")
            
            # Load and combine all province data
            dataframes = []
            for prov in provinces:
                try:
                    raw_df = load_csv(country, prov, dataset)
                    cleaned_df = clean_listings(
                        raw_df,
                        country=country,
                        province=prov,
                        dataset_name=dataset,
                    )
                    dataframes.append(cleaned_df)
                except (RegistryError, LoaderError):
                    # Skip provinces that don't have the dataset
                    continue
            
            if not dataframes:
                raise AnalyticsControllerError(
                    f"No data found for country '{country}' with dataset '{dataset}'."
                )
            
            # Combine all provinces
            cleaned_df = pd.concat(dataframes, ignore_index=True)
    
    except (RegistryError, LoaderError) as exc:
        raise AnalyticsControllerError(str(exc)) from exc
    
    # Compute all analytics
    property_type_dist = [
        PropertyTypeDistribution(**item)
        for item in analyze_property_type_distribution(cleaned_df)
    ]
    
    room_type_dist = [
        RoomTypeDistribution(**item)
        for item in analyze_room_type_distribution(cleaned_df)
    ]
    
    amenity_dist = [
        AmenityDistribution(**item)
        for item in analyze_amenity_distribution(cleaned_df)
    ]
    
    price_stats = PriceStatistics(**analyze_price_statistics(cleaned_df))
    review_stats = ReviewStatistics(**analyze_review_statistics(cleaned_df))
    instant_booking_stats = InstantBookingStats(**analyze_instant_booking_stats(cleaned_df))
    
    return AnalyticsResponse(
        country=country,
        province=province,
        property_type_distribution=property_type_dist,
        room_type_distribution=room_type_dist,
        amenity_distribution=amenity_dist,
        price_statistics=price_stats,
        review_statistics=review_stats,
        instant_booking_stats=instant_booking_stats,
    )

