#!/usr/bin/env python3
"""
Main application file for AirBNB Backend
Located in src/ folder for better organization
"""

import numpy as np
import pandas as pd
def main():


# Read the file (example: CSV file)
    df = pd.read_csv("")

# Show the table
# print(df)           # prints whole dataframe (not always pretty for large data)
print(df.head())    # shows first 5 rows
print(df.columns)   # show columns


if __name__ == "__main__":
    main()
