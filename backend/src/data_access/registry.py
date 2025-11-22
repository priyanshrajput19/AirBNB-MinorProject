"""
Registry utilities for locating CSV datasets on disk.

The functions below dynamically scan the `Data/` directory so that the backend
can answer questions like:
    - Which countries are available?
    - Which provinces (or states) exist within a given country?
    - Where is the CSV file for a specific combination of country/province/dataset?

Example usage:
    path = get_dataset_path("Canada", "Montreal", "listings")
    df = pandas.read_csv(path)
"""

from __future__ import annotations

from functools import lru_cache
import os
from pathlib import Path
from typing import Dict, List


class RegistryError(FileNotFoundError):
    """Raised when a requested country, province, or dataset does not exist."""


def _data_root() -> Path:
    """
    Resolve the absolute path to the root Data directory.

    Priority:
        1. Environment variable `DATA_ROOT` (matches .env.example guidance).
        2. Default to `<project_root>/backend/Data`.
    """
    env_path = os.getenv("DATA_ROOT")
    if env_path:
        candidate = Path(env_path).expanduser().resolve()
    else:
        candidate = Path(__file__).resolve().parents[2] / "Data"

    if not candidate.exists():
        raise RegistryError(
            f"Data directory not found at {candidate}. "
            "Set the DATA_ROOT environment variable to the correct path."
        )
    return candidate


def _normalize_key(value: str) -> str:
    """Normalize user-provided names for case-insensitive lookups."""
    return value.strip().lower().replace(" ", "_")


@lru_cache(maxsize=1)

def _country_map() -> Dict[str, Path]:
    """Return a mapping of normalized country names to their folder paths."""
    return {
        _normalize_key(folder.name): folder
        for folder in _data_root().iterdir()
        if folder.is_dir()
    }


def list_countries() -> List[str]:
    """
    List available countries based on subdirectories under the Data root.

    Returns the folder names exactly as they appear on disk, keeping the
    original casing (useful for UI dropdowns).
    """
    return sorted(folder.name for folder in _data_root().iterdir() if folder.is_dir())


def _province_map(country: str) -> Dict[str, Path]:
    """Return a mapping of normalized province names for the selected country."""
    country_key = _normalize_key(country)
    try:
        country_folder = _country_map()[country_key]
    except KeyError as exc:
        raise RegistryError(f"No data folder found for country '{country}'.") from exc

    return {
        _normalize_key(folder.name): folder
        for folder in country_folder.iterdir()
        if folder.is_dir()
    }


def list_provinces(country: str) -> List[str]:
    """
    List provinces/states for a given country based on subdirectories.

    Parameters:
        country: Human-friendly country name (case-insensitive).
    """
    province_map = _province_map(country)
    return sorted(path.name for path in province_map.values())


def get_dataset_path(country: str, province: str, dataset: str) -> Path:
    """
    Build an absolute path to a CSV dataset.

    Parameters:
        country: Country folder name (case-insensitive).
        province: Province/state folder name (case-insensitive).
        dataset: CSV file name (with or without `.csv` extension).
                 If exact match not found, will try to find files that start with the dataset name.

    Returns:
        A resolved `Path` pointing to the requested CSV file.
    """
    province_key = _normalize_key(province)
    province_map = _province_map(country)
    try:
        province_folder = province_map[province_key]
    except KeyError as exc:
        raise RegistryError(
            f"No data folder found for province '{province}' in country '{country}'."
        ) from exc

    # Normalize dataset name - remove .csv extension if present
    dataset_base = dataset.lower().replace(".csv", "").strip()
    
    # Get all CSV files in the province folder
    all_csv_files = [f for f in province_folder.iterdir() if f.is_file() and f.suffix.lower() == ".csv"]
    
    if not all_csv_files:
        raise RegistryError(
            f"No CSV files found under {province_folder}."
        )
    
    # Try exact match first (e.g., "listings.csv")
    exact_filename = f"{dataset_base}.csv"
    dataset_path = (province_folder / exact_filename).resolve()
    if dataset_path.exists():
        return dataset_path

    # If exact match not found, find files that start with the dataset base name
    # This handles cases like "listings 2.csv", "listings.csv", "listings_v2.csv" when searching for "listings"
    # The stem is the filename without extension (e.g., "listings 2" for "listings 2.csv")
    matching_files = [
        f for f in all_csv_files
        if f.stem.lower().startswith(dataset_base)  # stem = filename without extension
    ]

    if matching_files:
        # Sort to prefer exact matches, then shortest names (which usually means no numbers/suffixes)
        # This ensures "listings.csv" is preferred over "listings 2.csv" if both exist
        matching_files.sort(key=lambda x: (
            0 if x.stem.lower() == dataset_base else 1,  # Exact match first (listings.csv)
            0 if x.stem.lower() == f"{dataset_base} " else 1,  # Then "listings .csv" variants
            len(x.name),  # Shorter names preferred
            x.name  # Alphabetical as tiebreaker
        ))
        return matching_files[0].resolve()

    # If still not found, provide helpful error message
    available_files = [f.name for f in all_csv_files]
    raise RegistryError(
        f"Dataset '{dataset_base}.csv' not found under {province_folder}. "
        f"Available CSV files: {', '.join(available_files)}."
    )


