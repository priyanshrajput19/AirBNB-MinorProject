"""
Route handlers for listing-related API endpoints.

What will live here later:
    - A FastAPI `APIRouter` instance.
    - Functions like `@router.get("/listings")` that receive HTTP requests.
    - Inside those functions you will call controllers, e.g.
        `return listings_controller.get_listings(country="Canada")`

Example flow in plain English:
    1. User visits the frontend and picks Canada.
    2. Frontend calls GET /api/v1/listings?country=Canada.
    3. The route here parses the query parameters and delegates to the controller.
"""
