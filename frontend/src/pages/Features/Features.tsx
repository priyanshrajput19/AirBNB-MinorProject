import { Box, Typography, Container, Card, CardContent, Chip } from "@mui/material";

const Features = () => {
  const features = [
    {
      title: "Real-Time Analytics",
      description: "Get instant insights into market trends, pricing patterns, and occupancy rates with our advanced analytics engine.",
      tags: ["Live Data", "Market Trends", "Pricing Analysis"],
    },
    {
      title: "Competitive Intelligence",
      description: "Monitor your competition and understand market positioning with detailed competitor analysis and benchmarking tools.",
      tags: ["Competitor Analysis", "Market Positioning", "Benchmarking"],
    },
    {
      title: "Revenue Optimization",
      description: "Maximize your earnings with AI-powered pricing recommendations and demand forecasting based on historical data.",
      tags: ["AI Pricing", "Demand Forecast", "Revenue Boost"],
    },
    {
      title: "Performance Dashboard",
      description: "Track your listing performance with comprehensive metrics, guest reviews analysis, and booking trends visualization.",
      tags: ["Performance Metrics", "Guest Reviews", "Booking Trends"],
    },
    {
      title: "Market Research",
      description: "Explore new opportunities with detailed market research tools, neighborhood analysis, and investment insights.",
      tags: ["Market Research", "Neighborhood Analysis", "Investment Insights"],
    },
    {
      title: "Automated Reports",
      description: "Stay informed with automated weekly and monthly reports delivered directly to your inbox with key performance indicators.",
      tags: ["Automated Reports", "Weekly Updates", "KPI Tracking"],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, color: "#FF5A5F" }}>
          Powerful Features
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
          Everything you need to succeed as an Airbnb host, all in one comprehensive platform
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
        {features.map((feature, index) => (
          <Card
            key={index}
            sx={{
              height: "100%",
              p: 3,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
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
        ))}
      </Box>

      <Box textAlign="center" mt={8}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Ready to Transform Your Hosting Business?
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Start your free trial today and see the difference data-driven insights can make
        </Typography>
      </Box>
    </Container>
  );
};

export default Features;
