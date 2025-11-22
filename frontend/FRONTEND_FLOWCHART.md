# Frontend Flowchart - Airbnb Analytics Project

## 📊 Complete User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (/) ✅ DONE                      │
│  - Hero section with tagline                                    │
│  - "Get Started" button → redirects to /try-now                 │
│  - Features page accessible via navigation                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              TRY NOW PAGE (/try-now) ✅ DONE                     │
│  - Contains SearchBar component                                  │
│  - This is where the main analytics dashboard will be            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SEARCH & SELECTION SECTION                      │
│                         🔨 TODO                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Country Dropdown/Search                                 │  │
│  │  - Fetches from: GET /api/v1/listings/countries          │  │
│  │  - Auto-populates on page load                           │  │
│  │  - User selects: "Canada", "America", etc.               │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                        │
│                         ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Province Dropdown (Optional)                            │  │
│  │  - Fetches from: GET /api/v1/listings/provinces?country= │  │
│  │  - Auto-populates based on selected country              │  │
│  │  - User can select: "Montreal", "Toronto", etc.          │  │
│  │  - If NOT selected: aggregates entire country            │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                        │
│                         ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  "Show Analytics" Button                                 │  │
│  │  - Triggers API calls for analytics & listings           │  │
│  └──────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              MAIN DASHBOARD LAYOUT (75% Analytics)              │
│                         🔨 TODO                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ANALYTICS SECTION (Left/Top 75%)                        │  │
│  │  - Fetches: GET /api/v1/analytics/?country=X&province=Y  │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Chart 1: Property Type Distribution               │  │  │
│  │  │  - Material UI Pie/Bar Chart                       │  │  │
│  │  │  - Data: property_type_distribution                │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Chart 2: Room Type Distribution                   │  │  │
│  │  │  - Material UI Pie/Bar Chart                       │  │  │
│  │  │  - Data: room_type_distribution                    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Chart 3: Top Amenities                            │  │  │
│  │  │  - Material UI Bar Chart                           │  │  │
│  │  │  - Data: amenity_distribution (top 20)             │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Price Statistics Cards                            │  │  │
│  │  │  - Average, Highest, Lowest, Median                │  │  │
│  │  │  - Data: price_statistics                          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Review Statistics Cards                           │  │  │
│  │  │  - Total, Average, Max, Min                        │  │  │
│  │  │  - Data: review_statistics                         │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Instant Booking Stats                             │  │  │
│  │  │  - Pie Chart: Enabled vs Disabled                  │  │  │
│  │  │  - Data: instant_booking_stats                     │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  LISTINGS SECTION (Right/Bottom 25%)                     │  │
│  │  - Fetches: GET /api/v1/listings/?country=X&province=Y   │  │
│  │  - Scrollable list/table                                 │  │
│  │                                                           │  │
│  │  Display columns per listing:                            │  │
│  │  • id, name, listing_url                                 │  │
│  │  • picture_url (thumbnail)                               │  │
│  │  • price, property_types, room_type                      │  │
│  │  • number_of_reviews, bedrooms, bathrooms                │  │
│  │  • host_name, host_identity_verified                     │  │
│  │                                                           │  │
│  │  Features:                                               │  │
│  │  - Pagination (if > 100 listings)                        │  │
│  │  - Click to view details (future: modal)                 │  │
│  │  - Filter/sort options (future enhancement)              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FUTURE ENHANCEMENTS                         │
│                                                                  │
│  🔮 Listing Detail Modal/Page                                   │
│     - Full listing details with all fields                      │
│     - Map view with latitude/longitude                          │
│     - Amenities list                                            │
│                                                                  │
│  🔮 Advanced Filtering                                          │
│     - Price range slider                                        │
│     - Bedroom/bathroom filters                                  │
│     - Property type filter                                      │
│     - Instant booking filter                                    │
│                                                                  │
│  🔮 Comparison Mode                                             │
│     - Compare analytics between provinces                       │
│     - Compare analytics between countries                       │
│                                                                  │
│  🔮 Export Functionality                                        │
│     - Export listings to CSV                                    │
│     - Export analytics charts as images                         │
│                                                                  │
│  🔮 User Preferences                                            │
│     - Save favorite locations                                   │
│     - Default country/province selection                        │
│                                                                  │
│  🔮 Real-time Updates                                           │
│     - Auto-refresh data at intervals                            │
│     - WebSocket support (if CSV files update)                   │
│                                                                  │
│  🔮 Search/Filter within Listings                               │
│     - Client-side filtering on loaded listings                  │
│     - Search by name, host, property type                       │
└─────────────────────────────────────────────────────────────────┘
```

## 🏗️ Component Structure

```
frontend/src/
├── pages/
│   ├── LandingPage/ ✅ DONE
│   │   └── LandingPage.tsx
│   ├── Features/ ✅ DONE
│   │   └── Features.tsx
│   ├── TryNow/ ✅ DONE (but needs implementation)
│   │   └── TryNow.tsx
│   └── AnalyticsDashboard/ 🔨 TODO (NEW)
│       ├── AnalyticsDashboard.tsx
│       ├── AnalyticsDashboard.styles.ts
│       ├── components/
│       │   ├── CountryProvinceSelector.tsx
│       │   ├── AnalyticsCharts/
│       │   │   ├── PropertyTypeChart.tsx
│       │   │   ├── RoomTypeChart.tsx
│       │   │   ├── AmenityChart.tsx
│       │   │   ├── PriceStatsCard.tsx
│       │   │   ├── ReviewStatsCard.tsx
│       │   │   └── InstantBookingChart.tsx
│       │   └── ListingsList/
│       │       ├── ListingsList.tsx
│       │       ├── ListingCard.tsx
│       │       └── ListingCard.styles.ts
│
├── components/
│   ├── Header/ ✅ DONE
│   ├── Footer/ ✅ DONE
│   ├── Main/ ✅ DONE
│   └── Searchbar/ ✅ DONE (may need enhancement)
│
├── services/ 🔨 TODO (NEW)
│   └── api.ts
│       ├── getCountries()
│       ├── getProvinces(country)
│       ├── getListings(country, province)
│       └── getAnalytics(country, province)
│
├── hooks/ 🔨 TODO (NEW)
│   ├── useCountries.ts
│   ├── useProvinces.ts
│   ├── useListings.ts
│   └── useAnalytics.ts
│
└── utils/ 🔨 TODO (NEW)
    └── constants.ts
        └── API_BASE_URL
```

## 🔄 API Integration Flow

```
User Action Flow:
1. Page Load
   └─→ GET /api/v1/listings/countries
       └─→ Populate Country Dropdown

2. User Selects Country
   └─→ GET /api/v1/listings/provinces?country=X
       └─→ Populate Province Dropdown

3. User Clicks "Show Analytics"
   ├─→ GET /api/v1/analytics/?country=X&province=Y
   │   └─→ Update Analytics Charts (75% of screen)
   │
   └─→ GET /api/v1/listings/?country=X&province=Y
       └─→ Update Listings List (25% of screen)

4. User Changes Selection
   └─→ Repeat Step 3
```

## 📋 Implementation Checklist

### ✅ Already Done

- [x] Landing page with routing
- [x] Features page
- [x] TryNow page structure
- [x] Header and Footer components
- [x] SearchBar component (basic)
- [x] Material UI theme setup
- [x] Montserrat font globally applied
- [x] React Router setup

### 🔨 To Implement

- [ ] API service layer (axios integration)
- [ ] Country/Province selection dropdowns
- [ ] Analytics dashboard layout (75/25 split)
- [ ] Property Type Distribution Chart
- [ ] Room Type Distribution Chart
- [ ] Amenities Chart (top 20)
- [ ] Price Statistics Cards
- [ ] Review Statistics Cards
- [ ] Instant Booking Chart
- [ ] Listings List/Table component
- [ ] Listing Card component
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design for mobile/tablet

### 🔮 Future Enhancements

- [ ] Listing detail modal/page
- [ ] Advanced filtering
- [ ] Comparison mode
- [ ] Export functionality
- [ ] User preferences
- [ ] Real-time updates
- [ ] Client-side search/filter

## 🎨 Design Considerations

- **Layout**: 75% analytics (left/top) + 25% listings (right/bottom)
- **Charts**: Material UI Chart components (or Recharts/Chart.js with MUI styling)
- **Listings**: Scrollable with virtual scrolling for performance (if > 1000 items)
- **Responsive**: Stack vertically on mobile devices
- **Loading**: Skeleton loaders while fetching data
- **Errors**: User-friendly error messages with retry options
