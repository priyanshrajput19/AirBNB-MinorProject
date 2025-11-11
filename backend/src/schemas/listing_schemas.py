"""
Pydantic models for listing data.

Later you will define classes such as:

    class Listing(BaseModel):
        listing_id: str
        title: str
        nightly_price: float
        created_at: datetime
        updated_at: datetime

Simple explanation:
    - These models guarantee that whatever the controller returns matches a predictable structure.
    - They also serialize dates/numbers nicely for the frontend.
"""
