"""
Caching helpers to avoid re-reading the same CSV repeatedly.

Possible additions:
    - A decorator `@memoize` that stores function results in memory.
    - Wrappers around `functools.lru_cache`.
    - Simple manual cache with timestamps to control expiration.

Example idea:
    from functools import lru_cache

    @lru_cache(maxsize=10)
    def load_country_listings(country: str) -> list[dict]:
        ...
"""
