import { Box, Typography, Container, Card, CardContent } from "@mui/material";

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, color: "#FF5A5F" }}>
          About Airbnb Analytics
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
          Empowering hosts with data-driven insights to maximize their Airbnb success
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, mb: 6 }}>
        <Card sx={{ flex: 1, p: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom sx={{ color: "#FF5A5F", fontWeight: 600 }}>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              We believe that every Airbnb host deserves access to comprehensive market data and analytics. Our platform provides real-time insights into pricing trends, occupancy rates, and competitive analysis to help you make informed decisions.
            </Typography>
            <Typography variant="body1">Whether you're a new host or an experienced property manager, our tools are designed to maximize your revenue potential and streamline your hosting experience.</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, p: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom sx={{ color: "#FF5A5F", fontWeight: 600 }}>
              Why Choose Us
            </Typography>
            <Typography variant="body1" paragraph>
              • Real-time market data from thousands of listings
            </Typography>
            <Typography variant="body1" paragraph>
              • Advanced analytics and predictive modeling
            </Typography>
            <Typography variant="body1" paragraph>
              • User-friendly dashboard with actionable insights
            </Typography>
            <Typography variant="body1">• 24/7 support from our expert team</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box textAlign="center">
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
          Ready to Get Started?
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Join thousands of successful hosts who trust our platform
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
