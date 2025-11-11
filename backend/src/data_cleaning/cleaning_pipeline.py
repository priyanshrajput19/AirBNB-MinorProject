"""
Main cleaning workflow for listing data.

Eventually this file will include steps such as:
    - Dropping rows with missing essential fields.
    - Filling optional fields with defaults.
    - Converting price strings to numbers.
    - Renaming columns to snake_case (`created_at`, `updated_at`).

Example function idea:
    def clean_listings(raw_rows: list[dict]) -> list[dict]:
        # 1. Remove entries without a nightly_price.
        # 2. Convert strings to floats.
        # 3. Return cleaned dictionaries ready for schemas.
"""
