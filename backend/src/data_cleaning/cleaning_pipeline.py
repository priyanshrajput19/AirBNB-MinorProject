"""
Main cleaning workflow for listing data.

The `clean_listings` function below accepts a raw pandas DataFrame and metadata
about the dataset (country, province, dataset name). It performs the following:
    - Normalises column names to snake_case.
    - Applies configurable renames (e.g. convert `id` to `listing_id`).
    - Drops duplicate rows and rows that are entirely empty.
    - Handles missing values using sensible defaults.
    - Converts numeric and datetime columns to proper types.
    - Ensures required columns are present and non-null.
    - Adds `created_at` / `updated_at` timestamps when missing.

The behaviour can be customised per dataset using the `rules` argument so that
different CSV structures can reuse the same cleaning pipeline.
"""

from __future__ import annotations

from dataclasses import dataclass, field
import re
import unicodedata
from typing import Any, Dict, Mapping, Optional, Sequence

import pandas as pd
from pandas import DataFrame

from ..data_access.loader import load_csv
from ..data_access.registry import get_dataset_path


@dataclass
class CleaningRules:
    """Container describing how to clean a dataset."""

    required_columns: Sequence[str] = ()
    numeric_columns: Sequence[str] = ()
    datetime_columns: Sequence[str] = ()
    rename_map: Mapping[str, str] = field(default_factory=dict)
    fill_defaults: Mapping[str, Any] = field(default_factory=dict)
    drop_null_threshold: float = 1.0  # drop rows where all values are null


DEFAULT_RULES: Dict[str, CleaningRules] = {
    "default": CleaningRules(),
    "listings": CleaningRules(
        required_columns=("price", "latitude", "longitude"),
        numeric_columns=("price", "latitude", "longitude"),
        rename_map={"id": "listing_id"},
        fill_defaults={"price": 0.0},
    ),
}


def _resolve_rules(dataset_name: str, overrides: Optional[Mapping[str, Any]]) -> CleaningRules:
    """Merge default rules with dataset-specific and runtime overrides."""
    dataset_key = dataset_name.lower()
    base = DEFAULT_RULES["default"]
    dataset_rules = DEFAULT_RULES.get(dataset_key, CleaningRules())

    merged = CleaningRules(
        required_columns=dataset_rules.required_columns or base.required_columns,
        numeric_columns=dataset_rules.numeric_columns or base.numeric_columns,
        datetime_columns=dataset_rules.datetime_columns or base.datetime_columns,
        rename_map={**base.rename_map, **dataset_rules.rename_map},
        fill_defaults={**base.fill_defaults, **dataset_rules.fill_defaults},
        drop_null_threshold=dataset_rules.drop_null_threshold or base.drop_null_threshold,
    )

    if overrides:
        if "required_columns" in overrides:
            merged.required_columns = tuple(overrides["required_columns"])  # type: ignore[assignment]
        if "numeric_columns" in overrides:
            merged.numeric_columns = tuple(overrides["numeric_columns"])  # type: ignore[assignment]
        if "datetime_columns" in overrides:
            merged.datetime_columns = tuple(overrides["datetime_columns"])  # type: ignore[assignment]
        if "rename_map" in overrides:
            merged.rename_map = {**merged.rename_map, **overrides["rename_map"]}  # type: ignore[arg-type]
        if "fill_defaults" in overrides:
            merged.fill_defaults = {**merged.fill_defaults, **overrides["fill_defaults"]}  # type: ignore[arg-type]
        if "drop_null_threshold" in overrides:
            merged.drop_null_threshold = float(overrides["drop_null_threshold"])

    return merged


def _to_snake_case(value: str) -> str:
    """Convert arbitrary column names to snake_case ASCII identifiers."""
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    cleaned = re.sub(r"[^\w\s-]", "", ascii_value).strip().lower()
    snake = re.sub(r"[\s\-]+", "_", cleaned)
    return snake


def clean_listings(
    dataframe: DataFrame,
    *,
    country: str,
    province: str,
    dataset_name: str = "listings",
    rules: Optional[Mapping[str, Any]] = None,
) -> DataFrame:
    """
    Clean a raw listings DataFrame and return a normalised DataFrame.

    Parameters:
        dataframe: Raw data from CSV (as returned by `loader.load_csv`).
        country: Country identifier (informational, kept for future custom rules).
        province: Province/state identifier (informational).
        dataset_name: Dataset key (default "listings") used to select default rules.
        rules: Optional overrides (dict) with keys matching `CleaningRules` fields.

    Returns:
        pandas.DataFrame containing cleaned data ready for schema validation.
    """
    if dataframe.empty:
        return dataframe.copy()

    working_df = dataframe.copy()
    cleaning_rules = _resolve_rules(dataset_name, rules)

    # 1) Normalise column names and apply explicit renames.
    working_df.columns = [_to_snake_case(col) for col in working_df.columns]
    if cleaning_rules.rename_map:
        working_df = working_df.rename(columns=cleaning_rules.rename_map)

    # 2) Drop duplicates and rows that are entirely null.
    working_df = working_df.drop_duplicates()
    if cleaning_rules.drop_null_threshold >= 1.0:
        working_df = working_df.dropna(how="all")
    else:
        working_df = working_df.dropna(thresh=int(len(working_df.columns) * cleaning_rules.drop_null_threshold))

    # 3) Fill defaults for optional columns.
    for column, default_value in cleaning_rules.fill_defaults.items():
        if column in working_df.columns:
            working_df[column] = working_df[column].fillna(default_value)

    # 4) Convert numeric columns.
    for column in cleaning_rules.numeric_columns:
        if column in working_df.columns:
            working_df[column] = pd.to_numeric(working_df[column], errors="coerce")

    # 5) Convert datetime columns.
    for column in cleaning_rules.datetime_columns:
        if column in working_df.columns:
            working_df[column] = pd.to_datetime(working_df[column], errors="coerce", utc=True)

    # 6) Ensure required columns are present and non-null.
    if cleaning_rules.required_columns:
        missing_columns = [column for column in cleaning_rules.required_columns if column not in working_df.columns]
        if missing_columns:
            raise ValueError(
                f"Required columns {missing_columns} are missing for {country}/{province} ({dataset_name})."
            )

        working_df = working_df.dropna(
            subset=[col for col in cleaning_rules.required_columns if col in working_df.columns]
        )

    # 7) Add timestamps if missing.
    timestamp = pd.Timestamp.now(tz="UTC")
    if "created_at" not in working_df.columns:
        working_df["created_at"] = timestamp
    else:
        working_df["created_at"] = pd.to_datetime(working_df["created_at"], errors="coerce", utc=True).fillna(timestamp)

    if "updated_at" not in working_df.columns:
        working_df["updated_at"] = timestamp
    else:
        working_df["updated_at"] = pd.to_datetime(working_df["updated_at"], errors="coerce", utc=True).fillna(timestamp)

    # 8) Attach metadata columns for traceability.
    working_df["country"] = country
    working_df["province"] = province

    return working_df.reset_index(drop=True)


@dataclass
class CleaningReport:
    """Summary information about a cleaning run."""

    country: str
    province: str
    dataset: str
    input_rows: int
    output_rows: int
    dropped_rows: int
    null_counts_before: Dict[str, int]
    null_counts_after: Dict[str, int]
    output_path: str


def clean_and_save_dataset(
    *,
    country: str,
    province: str,
    dataset: str = "listings",
    output_filename: Optional[str] = None,
    cleaning_rules: Optional[Mapping[str, Any]] = None,
    overwrite: bool = False,
) -> CleaningReport:
    """
    Load a dataset, clean it, and persist the cleaned version to disk.

    Parameters:
        country: Country folder (e.g., "Canada").
        province: Province/state folder (e.g., "Montreal").
        dataset: Dataset filename without extension (default "listings").
        output_filename: Optional custom name for the cleaned file.
        cleaning_rules: Optional overrides passed to `clean_listings`.
        overwrite: Replace the original file when True.

    Returns:
        CleaningReport summarising the cleanup process.
    """
    raw_df = load_csv(country, province, dataset, refresh_cache=overwrite)
    null_counts_before = raw_df.isnull().sum().to_dict()

    cleaned_df = clean_listings(
        raw_df,
        country=country,
        province=province,
        dataset_name=dataset,
        rules=cleaning_rules,
    )
    null_counts_after = cleaned_df.isnull().sum().to_dict()

    source_path = get_dataset_path(country, province, dataset)
    if output_filename:
        filename = output_filename if output_filename.lower().endswith(".csv") else f"{output_filename}.csv"
        output_path = source_path.with_name(filename)
    else:
        suffix = "" if overwrite else "_clean"
        output_path = source_path.with_name(f"{source_path.stem}{suffix}.csv")

    cleaned_df.to_csv(output_path, index=False)

    return CleaningReport(
        country=country,
        province=province,
        dataset=dataset,
        input_rows=len(raw_df),
        output_rows=len(cleaned_df),
        dropped_rows=len(raw_df) - len(cleaned_df),
        null_counts_before=null_counts_before,
        null_counts_after=null_counts_after,
        output_path=str(output_path),
    )
