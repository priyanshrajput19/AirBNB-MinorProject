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

    filename = dataset if dataset.lower().endswith(".csv") else f"{dataset}.csv"
    dataset_path = (province_folder / filename).resolve()

    if not dataset_path.exists():
        raise RegistryError(
            f"Dataset '{filename}' not found under {province_folder}."
        )

    return dataset_path


