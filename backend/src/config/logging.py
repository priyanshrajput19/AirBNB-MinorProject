"""
Central logging configuration.

The real code will:
    - Configure Python's `logging` module or `loguru`.
    - Define a function like `setup_logging()` that sets formats and log levels.
    - Optionally read the desired level (info/debug) from `settings`.

Example:
    import logging

    def setup_logging() -> None:
        logging.basicConfig(
            level=settings.log_level,
            format="%(asctime)s - %(levelname)s - %(message)s"
        )
"""
