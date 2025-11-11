"""
Listing controller: this is where request validation and orchestration will happen.

Later you will add functions such as:

    def get_listings(country: str, filters: dict) -> list[ListingOut]:
        \"\"\"Load raw CSV rows for the country, clean them, apply filters, return clean data.\"\"\"

Typical responsibilities (explained simply):
    1. Check that a country like "Canada" exists in your Data folder.
    2. Call the data loader to read `Data/Canada/listings.csv`.
    3. Pass the raw rows through the cleaning pipeline so null values are handled.
    4. Apply filters or pagination.
    5. Return the cleaned results for the API route to send back.
"""
