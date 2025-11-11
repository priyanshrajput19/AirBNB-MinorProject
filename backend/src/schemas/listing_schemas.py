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
    """Envelope returned by list endpoints."""

    total: int
    country: str
    province: str
    items: list[Listing]
