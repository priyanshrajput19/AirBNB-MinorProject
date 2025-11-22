"""
Pydantic models for listing data returned by the API.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Union

from pydantic import BaseModel, Field


class Listing(BaseModel):
    """Single listing record returned to the frontend."""

    id: Optional[str] = Field(default=None, description="Unique identifier for the listing.")
    listing_url: Optional[str] = Field(default=None, description="Direct URL to the listing.")
    name: Optional[str] = Field(default=None, description="Name/title of the listing.")
    description: Optional[str] = Field(default=None, description="Short description.")
    neighborhood_overview: Optional[str] = Field(default=None, description="Neighbourhood description.")
    picture_url: Optional[str] = Field(default=None, description="Primary photo URL.")
    host_id: Optional[str] = Field(default=None, description="Unique identifier for the host.")
    host_url: Optional[str] = Field(default=None)
    host_name: Optional[str] = Field(default=None)
    host_since: Optional[datetime] = Field(default=None)
    host_location: Optional[str] = Field(default=None)
    host_about: Optional[str] = Field(default=None)
    host_total_listings_count: Optional[float] = Field(default=None)
    host_identity_verified: Optional[bool] = Field(default=None)
    property_types: Optional[str] = Field(default=None)
    room_type: Optional[str] = Field(default=None)
    accommodations: Optional[float] = Field(default=None, serialization_alias="accomodations")
    bathrooms: Optional[float] = Field(default=None)
    bathroom_texts: Optional[str] = Field(default=None)
    bedrooms: Optional[float] = Field(default=None)
    beds: Optional[float] = Field(default=None)
    amenities: Optional[Union[str, List[str]]] = Field(default=None)
    price: Optional[float] = Field(default=None, description="Nightly price in local currency.")
    number_of_reviews: Optional[float] = Field(default=None)
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    country: str
    province: str
    created_at: datetime
    updated_at: datetime


class ListingResponse(BaseModel):
    """Envelope returned by list endpoints with pagination support."""

    total: int = Field(description="Total number of listings available")
    country: str
    province: str
    page: int = Field(description="Current page number (1-indexed)")
    page_size: int = Field(description="Number of items per page")
    total_pages: int = Field(description="Total number of pages available")
    has_next: bool = Field(description="Whether there is a next page")
    has_previous: bool = Field(description="Whether there is a previous page")
    items: list[Listing] = Field(description="Listings for the current page")


class CountryListResponse(BaseModel):
    """List of available countries."""

    countries: list[str]


class ProvinceListResponse(BaseModel):
    """List of provinces/states for a given country."""

    country: str
    provinces: list[str]


# Analytics schemas
class PropertyTypeDistribution(BaseModel):
    """Distribution of listings by property type."""

    property_type: str
    count: int


class RoomTypeDistribution(BaseModel):
    """Distribution of listings by room type."""

    room_type: str
    count: int


class AmenityDistribution(BaseModel):
    """Distribution of listings by amenity."""

    amenity: str
    count: int


class PriceStatistics(BaseModel):
    """Price statistics for listings."""

    average: float
    highest: float
    lowest: float
    median: Optional[float] = None


class ReviewStatistics(BaseModel):
    """Review statistics for listings."""

    total: float
    average: float
    max: float
    min: float


class InstantBookingStats(BaseModel):
    """Instant booking statistics."""

    instant_booking_enabled: int
    instant_booking_disabled: int
    total: int


class AnalyticsResponse(BaseModel):
    """Complete analytics response for country/province."""

    country: str
    province: Optional[str] = None
    property_type_distribution: list[PropertyTypeDistribution]
    room_type_distribution: list[RoomTypeDistribution]
    amenity_distribution: list[AmenityDistribution]
    price_statistics: PriceStatistics
    review_statistics: ReviewStatistics
    instant_booking_stats: InstantBookingStats
