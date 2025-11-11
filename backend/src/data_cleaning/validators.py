"""
Reusable validation helpers for individual fields.

Typical checks you might add later:
    - Ensure numeric columns (price, occupancy_rate) are within expected ranges.
    - Validate date strings and convert them to datetime objects.
    - Confirm required columns exist in the CSV headers.

These functions will be used inside `cleaning_pipeline.py` to keep the logic tidy.
"""
