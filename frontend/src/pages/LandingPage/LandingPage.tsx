import { Box, Button, Stack, Typography } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { landingPageStyles } from "./LandingPage.styles";

const LandingPage = () => {
  return (
    <>
      <Box component="main" sx={landingPageStyles.main}>
        <Stack direction="column" spacing={1} sx={landingPageStyles.content}>
          <Typography sx={landingPageStyles.tagline}>One-stop solution for Airbnb insights. With real-time data and analytics.</Typography>
          <Typography sx={landingPageStyles.paragraph}>Gain deeper insights into Airbnb listings across your city, region, or country.</Typography>
          <Typography sx={landingPageStyles.paragraph}>From pricing trends to occupancy rates, our dashboard helps you make data-driven decisions that boost your hosting journey.</Typography>
          <Button variant="contained" sx={landingPageStyles.button} endIcon={<SendOutlinedIcon fontSize="small" />}>
            Get Started
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default LandingPage;
