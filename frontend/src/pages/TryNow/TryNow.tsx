import { Box, Typography, CircularProgress, Alert, Tabs, Tab, Pagination } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import Lenis from "lenis";
import SearchBar from "../../components/Searchbar/SearchBar";
import PropertyTypeChart from "../../components/AnalyticsCharts/PropertyTypeChart";
import RoomTypeChart from "../../components/AnalyticsCharts/RoomTypeChart";
import AmenityChart from "../../components/AnalyticsCharts/AmenityChart";
import PriceStatisticsCards from "../../components/AnalyticsCharts/PriceStatisticsCards";
import ReviewStatisticsCards from "../../components/AnalyticsCharts/ReviewStatisticsCards";
import InstantBookingChart from "../../components/AnalyticsCharts/InstantBookingChart";
import TopHostsList from "../../components/AnalyticsCharts/TopHostsList";
import ListingCard from "../../components/Listings/ListingCard";
import { tryNowStyles } from "./TryNow.styles";

type ChartType = "property" | "room" | "amenity" | "price" | "review" | "instant" | "hosts";

const API_BASE_URL = "http://localhost:8000/api/v1";

// Types for analytics data
interface PropertyTypeDistribution {
  property_type: string;
  count: number;
}

interface RoomTypeDistribution {
  room_type: string;
  count: number;
}

interface AmenityDistribution {
  amenity: string;
  count: number;
}

interface PriceStatistics {
  average: number;
  highest: number;
  lowest: number;
  median: number | null;
}

interface ReviewStatistics {
  total: number;
  average: number;
  max: number;
  min: number;
}

interface InstantBookingStats {
  instant_booking_enabled: number;
  instant_booking_disabled: number;
  total: number;
}

interface TopHost {
  host_id: string | null;
  host_name: string | null;
  host_location: string | null;
  host_since: string | null;
  host_about: string | null;
  host_identity_verified: boolean | null;
  total_listings_count: number;
  host_url: string | null;
  host_picture_url: string | null;
}

interface AnalyticsData {
  country: string;
  province: string | null;
  total_listings: number;
  property_type_distribution: PropertyTypeDistribution[];
  room_type_distribution: RoomTypeDistribution[];
  amenity_distribution: AmenityDistribution[];
  price_statistics: PriceStatistics;
  review_statistics: ReviewStatistics;
  instant_booking_stats: InstantBookingStats;
  top_hosts: TopHost[];
}

interface Listing {
  id: string | null;
  listing_url: string | null;
  name: string | null;
  description: string | null;
  neighborhood_overview: string | null;
  picture_url: string | null;
  host_name: string | null;
  host_about: string | null;
  property_types: string | null;
  room_type: string | null;
  accomodations: number | null; // Note: API uses "accomodations" (serialization alias)
  price: number | null;
}

interface ListingsResponse {
  total: number;
  country: string;
  province: string;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  items: Listing[];
}

const TryNow = () => {
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  const lenisInstanceRef = useRef<Lenis | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);
  const [errorAnalytics, setErrorAnalytics] = useState<string | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>("property");

  // Listings state
  const [listingsData, setListingsData] = useState<ListingsResponse | null>(null);
  const [loadingListings, setLoadingListings] = useState<boolean>(false);
  const [errorListings, setErrorListings] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const pageSize = 15;

  useEffect(() => {
    if (!scrollableContentRef.current) return;

    // Find the inner content box with data-lenis-content attribute
    const innerContent = scrollableContentRef.current.querySelector("[data-lenis-content]") as HTMLElement;
    if (!innerContent) return;

    // Create a new Lenis instance for the scrollable content div
    const lenis = new Lenis({
      wrapper: scrollableContentRef.current,
      content: innerContent,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisInstanceRef.current = lenis;

    // RAF loop for smooth scrolling
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Resize handler to update Lenis when content changes
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });

    resizeObserver.observe(scrollableContentRef.current);
    resizeObserver.observe(innerContent);

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
      lenis.destroy();
    };
  }, []);

  const handleSearch = async (country: string, province: string | null) => {
    setLoadingAnalytics(true);
    setLoadingListings(true);
    setErrorAnalytics(null);
    setErrorListings(null);
    setAnalyticsData(null);
    setListingsData(null);
    setCurrentPage(1);
    setSelectedCountry(country);
    setSelectedProvince(province);

    // Fetch analytics
    try {
      const analyticsParams = new URLSearchParams({
        country: country,
      });

      // Only add province if it's provided
      if (province && province.trim() !== "") {
        analyticsParams.append("province", province);
      }

      const analyticsResponse = await fetch(`${API_BASE_URL}/analytics/?${analyticsParams.toString()}`);

      if (!analyticsResponse.ok) {
        throw new Error(`Failed to fetch analytics: ${analyticsResponse.statusText}`);
      }

      const analyticsData: AnalyticsData = await analyticsResponse.json();
      setAnalyticsData(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setErrorAnalytics(error instanceof Error ? error.message : "Failed to fetch analytics data");
    } finally {
      setLoadingAnalytics(false);
    }

    // Fetch listings (only if province is provided, as listings API requires province)
    if (province && province.trim() !== "") {
      fetchListings(country, province, 1);
    } else {
      setLoadingListings(false);
      setListingsData(null);
      setErrorListings("Please select a province to view listings");
    }
  };

  const fetchListings = async (country: string, province: string, page: number) => {
    setLoadingListings(true);
    setErrorListings(null);

    try {
      const listingsParams = new URLSearchParams({
        country: country,
        province: province,
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      const listingsResponse = await fetch(`${API_BASE_URL}/listings/?${listingsParams.toString()}`);

      if (!listingsResponse.ok) {
        throw new Error(`Failed to fetch listings: ${listingsResponse.statusText}`);
      }

      const listingsData: ListingsResponse = await listingsResponse.json();
      setListingsData(listingsData);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setErrorListings(error instanceof Error ? error.message : "Failed to fetch listings data");
    } finally {
      setLoadingListings(false);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    if (selectedCountry && selectedProvince) {
      fetchListings(selectedCountry, selectedProvince, page);
      // Scroll to top of listings section
      if (scrollableContentRef.current) {
        scrollableContentRef.current.scrollTop = 0;
      }
    }
  };

  return (
    <>
      <Box sx={tryNowStyles.container}>
        <SearchBar onSearch={handleSearch} />

        {/* Main Content Box with Analytics and Listings */}
        <Box sx={tryNowStyles.contentBox}>
          {/* Analytics Section - Takes more space */}
          <Box
            sx={tryNowStyles.analyticsSection}
            onWheel={(e) => {
              e.stopPropagation();
            }}
          >
            {loadingAnalytics && (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px", flex: 1 }}>
                <CircularProgress />
              </Box>
            )}

            {errorAnalytics && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorAnalytics}
              </Alert>
            )}

            {!loadingAnalytics && !errorAnalytics && !analyticsData && (
              <Box sx={{ textAlign: "center", pt: 4, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h6" color="text.secondary">
                  Select a country and province, then click search to view analytics
                </Typography>
              </Box>
            )}

            {!loadingAnalytics && !errorAnalytics && analyticsData && (
              <Box sx={{ flex: 1, minHeight: 0 }}>
                {/* Header with Title and Chart Type Selector */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: "#FF5A5F", mb: 0.5 }}>
                      Analytics for {analyticsData.country}
                      {analyticsData.province && ` - ${analyticsData.province}`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      Total Listings: <span style={{ color: "#FF5A5F", fontWeight: 600 }}>{analyticsData.total_listings.toLocaleString()}</span>
                    </Typography>
                  </Box>

                  {/* Chart Type Selector - Tabs */}
                  <Tabs
                    value={selectedChartType}
                    onChange={(_, newValue: ChartType) => setSelectedChartType(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      "& .MuiTabs-indicator": {
                        backgroundColor: "#FF5A5F",
                      },
                      "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#666",
                        minWidth: "120px",
                        "&.Mui-selected": {
                          color: "#FF5A5F",
                        },
                      },
                    }}
                  >
                    <Tab label="Property Type" value="property" />
                    <Tab label="Room Type" value="room" />
                    <Tab label="Top Amenities" value="amenity" />
                    <Tab label="Price Stats" value="price" />
                    <Tab label="Review Stats" value="review" />
                    <Tab label="Instant Booking" value="instant" />
                    <Tab label="Top Hosts" value="hosts" />
                  </Tabs>
                </Box>

                {/* Chart Display Area */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    minHeight: "500px",
                    backgroundColor: "#fafafa",
                    borderRadius: "16px",
                    padding: 4,
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e8e8e8",
                    transition: "all 0.3s ease",
                  }}
                >
                  {selectedChartType === "property" && <PropertyTypeChart data={analyticsData.property_type_distribution} />}
                  {selectedChartType === "room" && <RoomTypeChart data={analyticsData.room_type_distribution} />}
                  {selectedChartType === "amenity" && <AmenityChart data={analyticsData.amenity_distribution} />}
                  {selectedChartType === "price" && <PriceStatisticsCards data={analyticsData.price_statistics} />}
                  {selectedChartType === "review" && <ReviewStatisticsCards data={analyticsData.review_statistics} />}
                  {selectedChartType === "instant" && <InstantBookingChart data={analyticsData.instant_booking_stats} />}
                  {selectedChartType === "hosts" && <TopHostsList data={analyticsData.top_hosts} />}
                </Box>
              </Box>
            )}
          </Box>

          {/* Listings Section - Scrollable, takes less space */}
          <Box sx={tryNowStyles.listingsSection}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#222222", mb: 0.5 }}>
                Listings
              </Typography>
              {listingsData && (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {listingsData.total.toLocaleString()} listings found
                  {listingsData.province && ` in ${listingsData.province}`}
                </Typography>
              )}
            </Box>

            {loadingListings && (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", flex: 1 }}>
                <CircularProgress />
              </Box>
            )}

            {errorListings && (
              <Alert severity="info" sx={{ mb: 2 }}>
                {errorListings}
              </Alert>
            )}

            {!loadingListings && !errorListings && !listingsData && (
              <Box sx={{ textAlign: "center", pt: 4, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Select a country and province, then click search to view listings
                </Typography>
              </Box>
            )}

            {!loadingListings && !errorListings && listingsData && (
              <>
                {/* Scrollable content area with Lenis smooth scroll */}
                <Box
                  ref={scrollableContentRef}
                  sx={tryNowStyles.scrollableContent}
                  onWheel={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Box data-lenis-content sx={{ display: "flex", flexDirection: "column" }}>
                    {listingsData.items.map((listing) => (
                      <ListingCard key={listing.id || Math.random()} listing={listing} />
                    ))}
                  </Box>
                </Box>

                {/* Pagination Controls */}
                {listingsData.total_pages > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2, pt: 2, borderTop: "1px solid #e8e8e8" }}>
                    <Pagination
                      count={listingsData.total_pages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          color: "#666",
                          "&.Mui-selected": {
                            backgroundColor: "#FF5A5F",
                            color: "#ffffff",
                            "&:hover": {
                              backgroundColor: "#FF4A4F",
                            },
                          },
                          "&:hover": {
                            backgroundColor: "rgba(255, 90, 95, 0.1)",
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TryNow;
