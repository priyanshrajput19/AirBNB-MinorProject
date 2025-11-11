"""
CSV loader utilities.

Responsibilities in simple terms:
    - Build file paths like `Data/Canada/Montreal/listings.csv` using the registry.
    - Read the CSV file with pandas.
    - Cache the result so repeated requests stay fast.
    - Return a pandas DataFrame to the controller for cleaning.

Implemented function:
    load_csv(country, province, dataset)
        * Validates the paths via the registry.
        * Reads the CSV into a DataFrame.
        * Uses LRU caching (by file path) so multiple calls reuse the same data.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

import pandas as pd

from .registry import get_dataset_path, RegistryError


class LoaderError(RuntimeError):
    """Raised when CSV loading fails for reasons other than missing files."""


def _cache_key(path: Path) -> str:
    """Create a stable string key for caching based on an absolute file path."""
    return str(path.resolve())


@lru_cache(maxsize=32)
def _load_csv_from_path(path_key: str) -> pd.DataFrame:
    """
    Internal helper used by `load_csv`. Receives a string key so it can be cached.

    Raises:
        LoaderError: if pandas fails to read the file.
    """
    path = Path(path_key)
    try:
        return pd.read_csv(path)
    except Exception as exc:  # pylint: disable=broad-except
        raise LoaderError(f"Failed to load CSV at {path}") from exc


def load_csv(country: str, province: str, dataset: str, *, refresh_cache: bool = False) -> pd.DataFrame:
    """
    Load a CSV as a pandas DataFrame for the given country/province/dataset combination.

    Parameters:
        country: Country folder name (case-insensitive).
        province: Province/state folder name (case-insensitive).
        dataset: CSV filename (with or without the `.csv` extension).
        refresh_cache: When True, bypass existing cached data and reload from disk.

    Returns:
        pandas.DataFrame: Raw data ready for cleaning.

    Raises:
        RegistryError: if the folder or dataset does not exist.
        LoaderError: if pandas cannot read the file.
    """
    dataset_path = get_dataset_path(country, province, dataset)
    path_key = _cache_key(dataset_path)

    if refresh_cache:
        _load_csv_from_path.cache_clear()

    return _load_csv_from_path(path_key)
