"""
Pydantic models for listing data returned by the API.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class Listing(BaseModel):
    """Single listing record returned to the frontend."""

    listing_id: Optional[str] = Field(default=None, description="Unique identifier for the listing.")
    name: Optional[str] = Field(default=None, description="Name/title of the listing.")
    description: Optional[str] = Field(default=None, description="Short description.")
    price: Optional[float] = Field(default=None, description="Nightly price in local currency.")
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    bedrooms: Optional[float] = Field(default=None)
    bathrooms: Optional[float] = Field(default=None)
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
