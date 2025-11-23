"""
Analytics-specific helper functions for computing statistics from cleaned listing data.
"""

from __future__ import annotations

import ast
from typing import Any, Dict, List

import pandas as pd
from pandas import DataFrame


def analyze_property_type_distribution(df: DataFrame) -> List[Dict[str, Any]]:
    """
    Count listings by property_type and room_type, combining them into one distribution.
    Returns a combined distribution with both property types and room types.
    """
    combined_counts: Dict[str, int] = {}
    
    # Add property types
    if "property_types" in df.columns:
        prop_counts = df["property_types"].value_counts().to_dict()
        for k, v in prop_counts.items():
            if pd.notna(k):
                key = f"Property: {str(k)}"
                combined_counts[key] = combined_counts.get(key, 0) + int(v)
    
    # Add room types
    if "room_type" in df.columns:
        room_counts = df["room_type"].value_counts().to_dict()
        for k, v in room_counts.items():
            if pd.notna(k):
                key = f"Room: {str(k)}"
                combined_counts[key] = combined_counts.get(key, 0) + int(v)
    
    # Convert to list format
    return [{"property_type": k, "count": v} for k, v in combined_counts.items()]


def analyze_room_type_distribution(df: DataFrame) -> List[Dict[str, Any]]:
    """
    Deprecated: Room type distribution is now combined with property type.
    Returns empty list to maintain backward compatibility.
    """
    return []


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


def analyze_instant_booking_stats(df: DataFrame) -> Dict[str, Any]:
    """
    Count listings by instant booking status and return list of enabled listings.
    
    Returns:
        Dict with counts and list of listings with instant booking enabled (name and id).
    """
    # Try common column name variations for instant booking
    instant_booking_col = None
    for col_name in ["instant_bookable", "has_availability", "instant_booking"]:
        if col_name in df.columns:
            instant_booking_col = col_name
            break
    
    if instant_booking_col is None:
        # Default to assuming all are disabled if column doesn't exist
        total = len(df)
        return {
            "instant_booking_enabled": 0,
            "instant_booking_disabled": total,
            "total": total,
            "enabled_listings": [],
        }
    
    # Filter listings with instant booking enabled
    enabled_df = df[df[instant_booking_col].fillna(False).astype(bool)].copy()
    
    # Count enabled/disabled
    enabled = int(len(enabled_df))
    total = len(df)
    disabled = total - enabled
    
    # Get enabled listings (name and id)
    enabled_listings = []
    if len(enabled_df) > 0:
        # Check for name and id columns (try variations)
        name_col = None
        id_col = None
        
        for col in df.columns:
            col_lower = col.lower()
            if col_lower in ["name", "listing_name", "title"]:
                name_col = col
            elif col_lower in ["id", "listing_id"]:
                id_col = col
        
        if name_col:
            for _, row in enabled_df.iterrows():
                listing_name = str(row[name_col]) if pd.notna(row[name_col]) else "Unnamed Listing"
                listing_id = None
                if id_col and id_col in row.index:
                    listing_id = str(row[id_col]) if pd.notna(row[id_col]) else None
                
                enabled_listings.append({
                    "name": listing_name,
                    "id": listing_id,
                })
    
    return {
        "instant_booking_enabled": enabled,
        "instant_booking_disabled": disabled,
        "total": total,
        "enabled_listings": enabled_listings,
    }


def analyze_top_hosts(df: DataFrame, top_n: int = 10) -> List[Dict[str, Any]]:
    """
    Analyze and return top hosts by listing count.
    
    Groups listings by host_id and aggregates host information.
    Returns top N hosts sorted by total listing count.
    """
    required_columns = ["host_id"]
    if not all(col in df.columns for col in required_columns):
        return []
    
    # Filter out rows with missing host_id
    df_filtered = df[df["host_id"].notna()].copy()
    
    if len(df_filtered) == 0:
        return []
    
    # Group by host_id and aggregate host information
    host_info = {}
    
    # Count actual listings per host (more accurate than host_total_listings_count field)
    host_counts = df_filtered["host_id"].value_counts().reset_index()
    host_counts.columns = ["host_id", "actual_listing_count"]
    
    # Ensure the count is integer
    host_counts["actual_listing_count"] = host_counts["actual_listing_count"].astype(int)
    
    # Get host information from first listing per host
    agg_dict = {
        "host_name": "first",
        "host_location": "first",
        "host_since": "first",
        "host_about": "first",
        "host_identity_verified": "first",
        "host_url": "first",
        "host_picture_url": "first",
    }
    
    host_details = df_filtered.groupby("host_id", as_index=False).agg(agg_dict)
    
    # Merge counts with details
    host_groups = host_counts.merge(host_details, on="host_id", how="left")
    
    # Rename to match expected column name
    host_groups.rename(columns={"actual_listing_count": "host_total_listings_count"}, inplace=True)
    
    # Sort by listing count descending and take top N
    host_groups = host_groups.sort_values("host_total_listings_count", ascending=False).head(top_n)
    
    # Convert to list of dictionaries
    top_hosts = []
    for _, row in host_groups.iterrows():
        host_dict = {
            "host_id": str(row["host_id"]) if pd.notna(row["host_id"]) else None,
            "host_name": str(row["host_name"]) if pd.notna(row["host_name"]) else None,
            "host_location": str(row["host_location"]) if pd.notna(row["host_location"]) else None,
            "host_since": row["host_since"] if pd.notna(row["host_since"]) else None,
            "host_about": str(row["host_about"]) if pd.notna(row["host_about"]) else None,
            "host_identity_verified": bool(row["host_identity_verified"]) if pd.notna(row["host_identity_verified"]) else None,
            "total_listings_count": int(row["host_total_listings_count"]),
            "host_url": str(row["host_url"]) if pd.notna(row["host_url"]) else None,
            "host_picture_url": str(row["host_picture_url"]) if pd.notna(row["host_picture_url"]) else None,
        }
        top_hosts.append(host_dict)
    
    return top_hosts
