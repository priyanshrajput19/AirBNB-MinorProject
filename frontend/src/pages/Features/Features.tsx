import { Box, Typography, Container, Card, CardContent, Chip } from "@mui/material";
import { useEffect, useState, useRef } from "react";

const Features = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Reset visible cards and initialization state when component mounts
    setVisibleCards(new Set());
    setIsInitialized(false);

    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setVisibleCards((prev) => {
              const newSet = new Set(prev);
              newSet.add(index);
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "200px 0px -50px 0px", // Trigger 200px before card enters viewport
      }
    );

    const observer = observerRef.current;

    // Function to check and animate visible cards
    const checkVisibleCards = () => {
      const currentRefs = cardsRef.current;
      const newVisibleCards = new Set<number>();

      currentRefs.forEach((card, index) => {
        if (card && observer) {
          observer.observe(card);

          // Check if card is already in viewport
          const rect = card.getBoundingClientRect();
          const isInViewport = rect.top < window.innerHeight + 200 && rect.bottom > -200;

          if (isInViewport) {
            newVisibleCards.add(index);
          }
        }
      });

      // Animate visible cards with staggered delay
      if (newVisibleCards.size > 0) {
        Array.from(newVisibleCards).forEach((index) => {
          setTimeout(() => {
            setVisibleCards((prev) => {
              const newSet = new Set(prev);
              newSet.add(index);
              return newSet;
            });
          }, index * 100);
        });
      }

      setIsInitialized(true);
    };

    // Initial check after DOM is ready - use multiple timeouts for reliability
    const timer1 = setTimeout(checkVisibleCards, 150);
    const timer2 = setTimeout(checkVisibleCards, 300);

    // Also check on scroll and resize to catch cards that become visible
    const handleScroll = () => {
      checkVisibleCards();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", checkVisibleCards);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkVisibleCards);
      if (observer) {
        cardsRef.current.forEach((card) => {
          if (card) observer.unobserve(card);
        });
      }
      observerRef.current = null;
    };
  }, []);

  const features = [
    {
      title: "Location-Based Analytics",
      description: "Filter and analyze Airbnb listings by country and province. View aggregated data for entire countries or drill down to specific regions for detailed insights.",
      tags: ["Country Filter", "Province Filter", "Regional Analysis"],
    },
    {
      title: "Property Type Distribution",
      description: "Understand the market composition with detailed breakdowns of property types. See how different accommodation types are distributed across locations.",
      tags: ["Property Types", "Market Composition", "Distribution Analysis"],
    },
    {
      title: "Price Statistics",
      description: "Get comprehensive price insights including average, median, highest, and lowest prices. Make informed decisions with accurate pricing data.",
      tags: ["Average Price", "Price Range", "Market Pricing"],
    },
    {
      title: "Room Type & Amenity Analysis",
      description: "Explore room type distributions and discover the top amenities that listings offer. See what features are most popular in each area.",
      tags: ["Room Types", "Top Amenities", "Feature Analysis"],
    },
    {
      title: "Review Statistics",
      description: "Analyze review patterns with total, average, maximum, and minimum review counts. Understand listing popularity and guest engagement.",
      tags: ["Review Counts", "Guest Engagement", "Popularity Metrics"],
    },
    {
      title: "Interactive Listings Browser",
      description: "Browse paginated listings with images, names, and detailed information. Expand listings to view full descriptions, host info, and neighborhood details. Book directly on Airbnb.",
      tags: ["Listings Display", "Detailed Info", "Direct Booking"],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }} id="features">
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, color: "#FF5A5F" }}>
          Powerful Features
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
          Explore Airbnb market data and analytics for any location. Get insights into pricing, property types, amenities, and more.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 4,
        }}
      >
        {features.map((feature, index) => {
          const isVisible = visibleCards.has(index);
          const delay = isInitialized ? index * 0.1 : 0;
          return (
            <Card
              key={index}
              ref={(el) => {
                if (el) {
                  cardsRef.current[index] = el;

                  // Check visibility immediately when ref is set
                  const checkCardVisibility = () => {
                    const rect = el.getBoundingClientRect();
                    const isInViewport = rect.top < window.innerHeight + 200 && rect.bottom > -200;

                    if (isInViewport && !visibleCards.has(index)) {
                      // Card is visible, animate it with staggered delay
                      setTimeout(() => {
                        setVisibleCards((prev) => {
                          const newSet = new Set(prev);
                          newSet.add(index);
                          return newSet;
                        });
                      }, index * 100);
                    } else if (observerRef.current && !visibleCards.has(index)) {
                      // Card not visible yet, observe it
                      observerRef.current.observe(el);
                    }
                  };

                  // Check visibility after a small delay to ensure layout is stable
                  setTimeout(checkCardVisibility, 50);

                  // Also check when observer is ready
                  if (observerRef.current && isInitialized) {
                    checkCardVisibility();
                  }
                }
              }}
              data-index={index}
              sx={{
                height: "100%",
                p: 3,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(50px)",
                transition: isVisible ? `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s, transform 0.3s ease, box-shadow 0.3s ease` : "opacity 0.3s ease-out, transform 0.3s ease-out",
                "&:hover": {
                  transform: isVisible ? "translateY(-4px)" : "translateY(50px)",
                  boxShadow: "0 8px 25px rgba(255, 90, 95, 0.15)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: "#FF5A5F", fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                  {feature.description}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {feature.tags.map((tag, tagIndex) => (
                    <Chip
                      key={tagIndex}
                      label={tag}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255, 90, 95, 0.1)",
                        color: "#FF5A5F",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
};

export default Features;
