# Airbnb Analytics Platform

A full-stack web application for analyzing Airbnb listing data, providing insights on property types, amenities, pricing, reviews, and more through interactive visualizations and detailed listings.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Backend Architecture](#backend-architecture)
  - [How It Works](#how-it-works-backend)
  - [Key Concepts](#key-concepts-backend)
  - [OOP Usage](#oop-usage-backend)
- [Frontend Architecture](#frontend-architecture)
  - [How It Works](#how-it-works-frontend)
  - [Key Concepts](#key-concepts-frontend)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)

---

## Overview

This project consists of two main parts:
- **Backend**: A FastAPI-based REST API that processes CSV files containing Airbnb listing data and provides analytics
- **Frontend**: A React-based web application that displays analytics through interactive charts and allows users to browse and filter listings

---

## Backend Architecture

### 🏗️ System Design

The backend follows a **layered architecture** pattern, which means the code is organized into different layers, each with a specific responsibility. Think of it like a restaurant: you have waiters (API layer), managers (controllers), chefs (services), and suppliers (data access).

```
┌─────────────────────────────────────┐
│     API Layer (FastAPI)             │  ← Receives HTTP requests
│     - Routes (Endpoints)            │
│     - Request/Response Schemas      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Controller Layer                │  ← Orchestrates the business logic
│     - Coordinates workflow          │
│     - Error handling                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Service Layer                   │  ← Pure calculation functions
│     - Data analysis                 │
│     - Statistics computation        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Data Cleaning Layer             │  ← Cleans and normalizes data
│     - Validation                    │
│     - Data transformation           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Data Access Layer               │  ← Reads CSV files
│     - File loading                  │
│     - Caching                       │
└─────────────────────────────────────┘
```

### How It Works (Backend)

Let's trace a typical request to understand the flow:

#### 1. **User Makes a Request**
When a user wants to see analytics for "Canada - Toronto":
- The frontend sends: `GET /api/v1/analytics/?country=Canada&province=Toronto`
- This request hits the **API Layer** (the routes)

#### 2. **Route Receives Request**
- `src/api/v1/routes/analytics.py` receives the request
- It validates the parameters (country, province)
- Then calls the **Controller Layer**

#### 3. **Controller Orchestrates Workflow**
- `src/api/v1/controllers/analytics_controller.py` acts like a manager:
  - Asks the **Data Access Layer** to load the CSV file
  - Sends raw data to the **Data Cleaning Layer** to clean it
  - Passes cleaned data to the **Service Layer** for analysis
  - Combines all results and returns them

#### 4. **Data Access Layer**
- `src/data_access/registry.py` finds the correct CSV file path
- `src/data_access/loader.py` loads the CSV file (with caching for performance)
- Returns raw data as a pandas DataFrame

#### 5. **Data Cleaning Layer**
- `src/data_cleaning/cleaning_pipeline.py` cleans the data:
  - Converts data types (strings to numbers, dates)
  - Handles missing values
  - Validates data integrity
- Returns cleaned DataFrame

#### 6. **Service Layer**
- `src/services/analytics_service.py` performs calculations:
  - Counts property types
  - Calculates average prices
  - Analyzes amenities
  - All functions are **pure functions** (no side effects, same input = same output)

#### 7. **Response Returns**
- Controller packages everything into a structured response
- Routes return JSON to the frontend

### Key Concepts (Backend)

#### 1. **FastAPI - The Web Framework**
- **What it is**: A modern Python web framework for building APIs
- **Why we use it**: 
  - Automatic API documentation
  - Fast performance
  - Type validation with Pydantic
  - Built-in async support

#### 2. **Layered Architecture**
- **What it is**: Separating code into layers with specific responsibilities
- **Why we use it**:
  - Easy to understand and maintain
  - Each layer can be tested independently
  - Changes in one layer don't break others
  - Reusable components

#### 3. **Pydantic Models (Schemas)**
- **What it is**: Data validation using Python classes
- **Why we use it**:
  - Ensures data sent/received is in correct format
  - Automatic validation
  - Self-documenting API (shows expected structure)
  - Type safety

#### 4. **Pandas DataFrames**
- **What it is**: A data structure for working with tabular data (like Excel spreadsheets)
- **Why we use it**:
  - Efficient data manipulation
  - Easy filtering, grouping, aggregation
  - Handles large datasets well
  - Built-in data analysis functions

#### 5. **LRU Cache**
- **What it is**: Stores recently used data in memory
- **Why we use it**:
  - Avoids re-reading same CSV files repeatedly
  - Faster response times
  - Reduces disk I/O

#### 6. **Error Handling with Custom Exceptions**
- **What it is**: Creating specific error types for different problems
- **Why we use it**:
  - Clear error messages for debugging
  - Proper HTTP status codes
  - Better user experience

### OOP Usage (Backend)

While the backend primarily uses **functional programming** (functions, not classes), OOP concepts are used in several places:

#### 1. **Dataclasses (Data Containers)**
**Location**: `src/data_cleaning/cleaning_pipeline.py`

```python
@dataclass
class CleaningRules:
    required_columns: tuple = ()
    numeric_columns: tuple = ()
    # ...
```

**Why OOP here?**:
- Dataclasses group related data together
- Makes configuration easy to pass around
- Provides default values
- Self-documenting (you know what fields are needed)

#### 2. **Pydantic Models (Data Validation)**
**Location**: `src/schemas/listing_schemas.py`

```python
class Listing(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    # ...
```

**Why OOP here?**:
- Classes define the structure of data
- Inheritance allows reusing common fields
- Validation happens automatically
- Easy to extend with new fields

#### 3. **Custom Exception Classes**
**Location**: Various controller files

```python
class AnalyticsControllerError(RuntimeError):
    """Raised when analytics cannot be computed."""
```

**Why OOP here?**:
- Specific error types help identify problems
- Can catch specific errors differently
- Better error messages
- Inheritance from base Exception class

#### 4. **Why Mostly Functional Programming?**

The core business logic uses functions instead of classes because:
- **Simplicity**: Functions are easier to test and understand
- **Stateless**: Analytics functions don't need to remember state
- **Reusability**: Functions can be composed together easily
- **Pure Functions**: Same input always gives same output (predictable)

---

## Frontend Architecture

### 🎨 System Design

The frontend uses a **component-based architecture** built with React. Think of it like building blocks - each component is a reusable piece of the UI.

```
┌─────────────────────────────────────┐
│     App.tsx (Root Component)        │  ← Main entry point
│     - Routing                       │
│     - Theme provider                │
│     - Global state                  │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
┌──────────────┐ ┌──────────────┐
│  Pages       │ │  Components  │
│  - Landing   │ │  - Header    │
│  - TryNow    │ │  - SearchBar │
│  - Features  │ │  - Charts    │
└──────────────┘ └──────────────┘
```

### How It Works (Frontend)

Let's trace what happens when a user interacts with the app:

#### 1. **Application Starts**
- User opens the website in a browser
- `main.tsx` renders the `App` component
- React Router sets up navigation
- Splash screen shows (first time only)

#### 2. **User Navigates to Try Now Page**
- User clicks "Try Now" or navigates to `/try-now`
- React Router loads `TryNow.tsx` component
- Component renders:
  - `SearchBar` component (for selecting country/province)
  - Analytics section (initially empty)
  - Listings section (initially empty)

#### 3. **User Selects Location and Searches**
- User selects country from dropdown → triggers API call to get provinces
- User selects province (optional) → API calls are ready
- User clicks search button → triggers `handleSearch` function
- Function makes two API calls:
  - Analytics API (for charts)
  - Listings API (for property listings)

#### 4. **Data Fetches and Displays**
- Analytics data arrives → state updates → charts render
- Listings data arrives → state updates → listing cards render
- User can switch between different chart types using tabs

#### 5. **User Interacts with Charts**
- User clicks on a property type chip → filters listings
- User clicks on an amenity chip → filters listings
- Filter state updates → new API call with filter parameters
- Listings section updates to show filtered results

#### 6. **Smooth User Experience**
- Lenis library provides smooth scrolling
- Loading states show spinners while data loads
- Error states display friendly messages
- Animations make transitions smooth

### Key Concepts (Frontend)

#### 1. **React - Component Library**
- **What it is**: A JavaScript library for building user interfaces
- **Why we use it**:
  - Component reusability
  - Efficient updates (only re-renders what changed)
  - Large ecosystem
  - Declarative (describe what you want, not how)

#### 2. **TypeScript**
- **What it is**: JavaScript with type checking
- **Why we use it**:
  - Catches errors before runtime
  - Better IDE support (autocomplete)
  - Self-documenting code
  - Easier refactoring

#### 3. **React Hooks (State Management)**
- **useState**: Stores component data that can change
- **useEffect**: Runs code when component mounts or data changes
- **useRef**: References DOM elements directly
- **Why we use them**:
  - Modern React pattern
  - No need for class components
  - Easy state management
  - Side effect handling

#### 4. **React Router**
- **What it is**: Navigation library for React
- **Why we use it**:
  - Single Page Application (SPA) navigation
  - URL-based routing
  - Browser back/forward buttons work
  - Programmatic navigation

#### 5. **Material-UI (MUI)**
- **What it is**: Pre-built React components library
- **Why we use it**:
  - Beautiful, consistent UI
  - Responsive design
  - Accessibility built-in
  - Less custom CSS needed

#### 6. **Material-UI Charts (@mui/x-charts)**
- **What it is**: Charting library for React
- **Why we use it**:
  - Easy to create charts
  - Interactive by default
  - Consistent with Material Design
  - Responsive

#### 7. **Lenis (Smooth Scrolling)**
- **What it is**: Smooth scrolling library
- **Why we use it**:
  - Better user experience
  - Smooth animations
  - Works with nested scrollable areas
  - Professional feel

#### 8. **Component Architecture**
- **What it is**: Breaking UI into reusable pieces
- **Why we use it**:
  - DRY (Don't Repeat Yourself)
  - Easy to maintain
  - Test individual components
  - Team collaboration

#### 9. **Props and State**
- **Props**: Data passed from parent to child (read-only)
- **State**: Internal component data (can change)
- **Why this pattern**:
  - Unidirectional data flow
  - Predictable updates
  - Easy debugging

#### 10. **Separation of Concerns**
- Components in `components/` folder
- Pages in `pages/` folder
- Styles in separate `.styles.ts` files
- **Why**:
  - Organized codebase
  - Easy to find things
  - Maintainable

---

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python run.py
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

The app will be available at `http://localhost:5173`

---

## Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── main.py                 # FastAPI app entry point
│   ├── api/v1/
│   │   ├── routes/             # HTTP endpoints
│   │   └── controllers/        # Business logic orchestration
│   ├── services/               # Pure calculation functions
│   ├── data_access/            # CSV loading and caching
│   ├── data_cleaning/          # Data normalization
│   ├── schemas/                # Pydantic models
│   └── utils/                  # Helper utilities
├── Data/                       # CSV data files
└── requirements.txt            # Python dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Root component with routing
│   ├── components/             # Reusable UI components
│   │   ├── Header/
│   │   ├── SearchBar/
│   │   ├── AnalyticsCharts/
│   │   └── Listings/
│   ├── pages/                  # Page components
│   │   ├── LandingPage/
│   │   ├── Features/
│   │   └── TryNow/
│   ├── theme/                  # Material-UI theme
│   └── assets/                 # Images, fonts, icons
└── package.json                # Node dependencies
```

---

## Features

### Analytics Features
- ✅ Property & Room Type Distribution (combined)
- ✅ Amenity Analysis (Top amenities with counts)
- ✅ Price Statistics (Average, Median, Highest, Lowest)
- ✅ Review Statistics
- ✅ Instant Booking Analysis
- ✅ Top 10 Hosts by Listing Count

### Listings Features
- ✅ Paginated Listings Display
- ✅ Filter by Property/Room Type
- ✅ Filter by Amenity
- ✅ Expandable Listing Cards
- ✅ Direct booking links to Airbnb

### UI/UX Features
- ✅ Smooth scrolling
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Interactive charts
- ✅ Search functionality

---

## Technology Stack

### Backend
- **FastAPI** - Web framework
- **Pandas** - Data processing
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **React Router** - Navigation
- **Vite** - Build tool

---

## License

This project is for educational purposes.
