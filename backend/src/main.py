#!/usr/bin/env python3
"""
Main application file for AirBNB Backend
Located in src/ folder for better organization
"""

import numpy as np
import pandas as pd
from tabulate import tabulate

def readfile(country,province):
    return pd.read_csv(f"../Data/{country}/{province}/listings 2.csv")

def main():
    province_data = readfile("Canada","Montreal")
    # Select only the columns you want to display
    selected_columns = ['id', 'scrape_id', 'last_scraped']
    montreal_subset = montreal[selected_columns].head(3)
    print(tabulate(montreal_subset, headers='keys', tablefmt='grid'))
  



if __name__ == "__main__":
    main()