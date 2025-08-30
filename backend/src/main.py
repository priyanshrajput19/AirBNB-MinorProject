#!/usr/bin/env python3
"""
Main application file for AirBNB Backend
Located in src/ folder for better organization
"""

import numpy as np
import pandas as pd
from tabulate import tabulate

def main():
    # Read the file
    df = pd.read_csv("../Data/Canada/Montreal/listings.csv")
    
    print("=" * 100)
    print("AIRBNB MONTREAL LISTINGS - FIRST 3 ROWS")
    print("=" * 100)
    
    # Create a beautiful table with tabulate
    # Select only the most important columns for better readability

    columns =['id', 'name', 'neighbourhood', 'room_type', 'price', 'number_of_reviews']
    df_subset = df[columns]
    # Create a subset with important columns
    
    # Display as a beautiful table
    print(tabulate(df_subset.head(3), headers='keys', tablefmt='grid', showindex=False))
    
    print("\n" + "=" * 100)
    print("ALL COLUMNS IN DATASET:")
    print("=" * 100)
    
    # Show all columns in a nice list format
    for i, col in enumerate(df.columns, 1):
        print(f"{i:2d}. {col}")
    
    print(f"\nTotal rows: {len(df)}")
    print(f"Total columns: {len(df.columns)}")
    
    # Show data types in a table format
    print("\n" + "=" * 100)
    print("DATA TYPES:")
    print("=" * 100)
    
    dtype_df = pd.DataFrame({
        'Column': df.columns,
        'Data Type': df.dtypes,
        'Non-Null Count': df.count()
    })
    
    print(tabulate(dtype_df, headers='keys', tablefmt='grid', showindex=False))
    
    # NEW: NULL VALUE ANALYSIS
    print("\n" + "=" * 100)
    print("NULL VALUE ANALYSIS:")
    print("=" * 100)
    
    # Method 1: Count NULL values in each column
    null_counts = df.isnull().sum()
    null_percentages = (df.isnull().sum() / len(df)) * 100
    
    null_df = pd.DataFrame({
        'Column': df.columns,
        'Null Count': null_counts,
        'Null Percentage': null_percentages.round(2)
    })
    
    # Filter to show only columns with NULL values
    null_df_filtered = null_df[null_df['Null Count'] > 0].sort_values('Null Count', ascending=False)
    
    if len(null_df_filtered) > 0:
        print("Columns with NULL values:")
        print(tabulate(null_df_filtered, headers='keys', tablefmt='grid', showindex=False))
    else:
        print("No NULL values found in the dataset!")
    
    # Method 2: Show total NULL values in the entire dataset
    total_nulls = df.isnull().sum().sum()
    print(f"\nTotal NULL values in entire dataset: {total_nulls}")
    
    # Method 3: Show rows with any NULL values
    rows_with_nulls = df[df.isnull().any(axis=1)]
    print(f"Rows containing at least one NULL value: {len(rows_with_nulls)}")
    
    # Method 4: Show specific examples of NULL values (first 5 rows)
    if len(rows_with_nulls) > 0:
        print("\nFirst 5 rows with NULL values:")
        null_columns = df.columns[df.isnull().any()].tolist()
        null_examples = rows_with_nulls[null_columns].head(5)
        print(tabulate(null_examples, headers='keys', tablefmt='grid', showindex=False))
    
    # Method 5: Check for different types of missing data
    print("\n" + "=" * 100)
    print("MISSING DATA PATTERNS:")
    print("=" * 100)
    
    # Check for empty strings, whitespace, and other common missing data patterns
    empty_strings = (df == '').sum()
    # Check for whitespace-only strings using string methods on each column
    whitespace_only = pd.Series([(df[col].astype(str).str.strip() == '').sum() for col in df.columns], index=df.columns)
    
    missing_patterns = pd.DataFrame({
        'Column': df.columns,
        'Empty Strings': empty_strings,
        'Whitespace Only': whitespace_only
    })
    
    # Filter to show only columns with these patterns
    missing_patterns_filtered = missing_patterns[
        (missing_patterns['Empty Strings'] > 0) | 
        (missing_patterns['Whitespace Only'] > 0)
    ]
    
    if len(missing_patterns_filtered) > 0:
        print("Columns with empty strings or whitespace-only values:")
        print(tabulate(missing_patterns_filtered, headers='keys', tablefmt='grid', showindex=False))

if __name__ == "__main__":
    main()