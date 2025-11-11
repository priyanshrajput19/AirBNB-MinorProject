"""
App configuration module.

What will be added later:
    - A Pydantic `BaseSettings` class that reads environment variables such as:
        * `DATA_ROOT` → absolute path to the Data folder.
        * `LOG_LEVEL` → info / debug / warning.
        * `CACHE_TTL_SECONDS` → how long to cache CSV reads.
    - A singleton `settings = Settings()` instance reused across the backend.

Example usage inside other modules (in plain language):
    from src.config.settings import settings
    data_dir = settings.data_root  # Points to /Users/.../backend/Data
"""
