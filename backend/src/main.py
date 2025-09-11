#!/usr/bin/env python3
"""
Main application file for AirBNB Backend
Located in src/ folder for better organization
"""

import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tabulate import tabulate
import uvicorn

# Create FastAPI app
app = FastAPI(title="AirBNB Analytics API", version="1.0.0")

@app.get("/")
async def read_root():
    print("Hello World")
    return {"message": "Hello World"}






def main():
    """Run the server"""
    print("Starting AirBNB Analytics API server...")
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    main()