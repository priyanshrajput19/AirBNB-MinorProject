import { Box, Button, Stack, Typography } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { landingPageStyles } from "./LandingPage.styles";
import backgroundImage from "../../assets/images/pexels-frans-van-heerden-201846-1438832.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate("/try-now");
  };

  return (
    <>
      <Box
        component="main"
        id="home"
        sx={{
          ...landingPageStyles.main,
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        {/* Background Image Overlay */}
        <Box sx={landingPageStyles.backgroundOverlay} />

        {/* Content */}
        <Stack className="landing-page-content" direction="column" spacing={3} sx={landingPageStyles.content}>
          <Typography
            sx={{
              ...landingPageStyles.tagline,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
            }}
          >
            Explore Airbnb Market Data & Analytics for Any Location
          </Typography>

          <Typography
            sx={{
              ...landingPageStyles.paragraph,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s",
            }}
          >
            Discover comprehensive insights into Airbnb listings across different countries, provinces, and cities. Our analytics platform helps you understand market trends, pricing patterns, and property distributions to make informed decisions.
          </Typography>

          <Box
            sx={{
              ...landingPageStyles.featuresBox,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s",
            }}
          >
            <Typography sx={landingPageStyles.subheading}>What You Can Explore:</Typography>
            <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
              <Box sx={landingPageStyles.featureItem}>
                <Typography sx={landingPageStyles.featureText}>
                  📊 <strong>Analytics Dashboard:</strong> View property type distributions, room types, top amenities, and pricing statistics for any location
                </Typography>
              </Box>
              <Box sx={landingPageStyles.featureItem}>
                <Typography sx={landingPageStyles.featureText}>
                  📍 <strong>Location-Based Filtering:</strong> Filter and analyze data by country or province to get region-specific insights
                </Typography>
              </Box>
              <Box sx={landingPageStyles.featureItem}>
                <Typography sx={landingPageStyles.featureText}>
                  🏠 <strong>Detailed Listings:</strong> Browse paginated listings with photos, descriptions, host information, and direct booking links to Airbnb
                </Typography>
              </Box>
              <Box sx={landingPageStyles.featureItem}>
                <Typography sx={landingPageStyles.featureText}>
                  📈 <strong>Market Intelligence:</strong> Analyze review statistics, instant booking trends, and accommodation patterns to understand market dynamics
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Typography
            sx={{
              ...landingPageStyles.footerText,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.8s ease-out 0.8s, transform 0.8s ease-out 0.8s",
            }}
          >
            Whether you're a potential host researching markets, an investor analyzing opportunities, or a traveler exploring options, our platform provides the data-driven insights you need.
          </Typography>

          <Button
            variant="contained"
            sx={{
              ...landingPageStyles.button,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
              transition: "opacity 0.8s ease-out 1s, transform 0.8s ease-out 1s",
            }}
            endIcon={<SendOutlinedIcon fontSize="small" />}
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default LandingPage;
