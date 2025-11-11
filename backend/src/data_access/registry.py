"""
Keeps a registry of available countries and their CSV locations.

Planned content:
    - A dictionary/map like `{"canada": Path("Data/Canada")}`.
    - Helper functions such as:
        * `list_countries()` → ["Canada", "America", "Australia"].
        * `get_listing_path(country)` → returns the exact file path for listings.
    - Error handling when a requested country folder does not exist.

Simple example:
    def get_listing_path(country: str) -> Path:
        normalized = country.lower()
        folder = COUNTRY_FOLDER_MAP[normalized]
        return folder / "listings.csv"
"""
