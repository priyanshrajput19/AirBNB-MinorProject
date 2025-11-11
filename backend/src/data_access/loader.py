"""
CSV loader utilities.

Responsibilities in simple terms:
    - Build file paths like `Data/Canada/listings.csv` using the registry.
    - Read the CSV file (e.g., with `pandas.read_csv` or the `csv` module).
    - Cache the result so repeated requests stay fast.
    - Return raw records to the controller for cleaning.

Example future function:
    def load_country_listings(country: str) -> pandas.DataFrame:
        path = registry.get_listing_path(country)
        return pandas.read_csv(path)
"""
