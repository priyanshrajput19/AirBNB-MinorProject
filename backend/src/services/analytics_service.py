"""
Analytics-specific helper functions for computing statistics from cleaned listing data.
"""

from __future__ import annotations

import ast
from typing import Any, Dict, List

import pandas as pd
from pandas import DataFrame


def analyze_property_type_distribution(df: DataFrame) -> List[Dict[str, Any]]:
    """Count listings by property_type."""
    if "property_types" not in df.columns:
        return []
    counts = df["property_types"].value_counts().to_dict()
    return [{"property_type": str(k), "count": int(v)} for k, v in counts.items() if pd.notna(k)]


def analyze_room_type_distribution(df: DataFrame) -> List[Dict[str, Any]]:
    """Count listings by room_type."""
    if "room_type" not in df.columns:
        return []
    counts = df["room_type"].value_counts().to_dict()
    return [{"room_type": str(k), "count": int(v)} for k, v in counts.items() if pd.notna(k)]


def analyze_amenity_distribution(df: DataFrame, top_n: int = 20) -> List[Dict[str, Any]]:
    """Count listings by individual amenity (from amenities column)."""
    if "amenities" not in df.columns:
        return []
    
    amenity_counts: Dict[str, int] = {}
    
    for amenities_str in df["amenities"].dropna():
        if pd.isna(amenities_str):
            continue
        
        # Try to parse as list if it's a string representation
        try:
            if isinstance(amenities_str, str):
                # Handle both JSON list strings and comma-separated values
                if amenities_str.strip().startswith("["):
                    amenities_list = ast.literal_eval(amenities_str)
                else:
                    amenities_list = [a.strip() for a in amenities_str.split(",") if a.strip()]
            elif isinstance(amenities_str, list):
                amenities_list = amenities_str
            else:
                continue
            
            for amenity in amenities_list:
                if amenity and str(amenity).strip():
                    amenity_counts[str(amenity).strip()] = amenity_counts.get(str(amenity).strip(), 0) + 1
        except (ValueError, SyntaxError):
            # If parsing fails, treat as single amenity
            if str(amenities_str).strip():
                amenity_counts[str(amenities_str).strip()] = amenity_counts.get(str(amenities_str).strip(), 0) + 1
    
    # Sort by count descending and take top N
    sorted_amenities = sorted(amenity_counts.items(), key=lambda x: x[1], reverse=True)[:top_n]
    return [{"amenity": k, "count": v} for k, v in sorted_amenities]


def analyze_price_statistics(df: DataFrame) -> Dict[str, float]:
    """Compute price statistics: average, highest, lowest, median."""
    if "price" not in df.columns:
        return {"average": 0.0, "highest": 0.0, "lowest": 0.0, "median": 0.0}
    
    price_series = pd.to_numeric(df["price"], errors="coerce").dropna()
    
    if len(price_series) == 0:
        return {"average": 0.0, "highest": 0.0, "lowest": 0.0, "median": 0.0}
    
    return {
        "average": float(price_series.mean()),
        "highest": float(price_series.max()),
        "lowest": float(price_series.min()),
        "median": float(price_series.median()),
    }


def analyze_review_statistics(df: DataFrame) -> Dict[str, float]:
    """Compute review statistics: total, average, max, min."""
    if "number_of_reviews" not in df.columns:
        return {"total": 0.0, "average": 0.0, "max": 0.0, "min": 0.0}
    
    review_series = pd.to_numeric(df["number_of_reviews"], errors="coerce").dropna()
    
    if len(review_series) == 0:
        return {"total": 0.0, "average": 0.0, "max": 0.0, "min": 0.0}
    
    return {
        "total": float(review_series.sum()),
        "average": float(review_series.mean()),
        "max": float(review_series.max()),
        "min": float(review_series.min()),
    }


def analyze_instant_booking_stats(df: DataFrame) -> Dict[str, int]:
    """Count listings by instant booking status."""
    # Try common column name variations for instant booking
    instant_booking_col = None
    for col_name in ["instant_bookable", "has_availability", "instant_booking"]:
        if col_name in df.columns:
            instant_booking_col = col_name
            break
    
    if instant_booking_col is None:
        # Default to assuming all are disabled if column doesn't exist
        total = len(df)
        return {"instant_booking_enabled": 0, "instant_booking_disabled": total, "total": total}
    
    # Count true/false values
    enabled = int(df[instant_booking_col].fillna(False).astype(bool).sum())
    total = len(df)
    disabled = total - enabled
    
    return {
        "instant_booking_enabled": enabled,
        "instant_booking_disabled": disabled,
        "total": total,
    }
