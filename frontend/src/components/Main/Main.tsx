import { Box, Button, Stack, Typography } from "@mui/material";
import { mainStyle } from "./main.style";

const Main = () => {
  return (
    <>
      <Box component="main" sx={mainStyle.main}>
        <Stack direction="column" spacing={1} sx={mainStyle.content}>
          <Typography sx={mainStyle.tagline}>One-stop solution for Airbnb insights. With real-time data and analytics.</Typography>
          <Typography sx={mainStyle.paragraph}>Gain deeper insights into Airbnb listings across your city, region, or country.</Typography>
          <Typography sx={mainStyle.paragraph}>From pricing trends to occupancy rates, our dashboard helps you make data-driven decisions that boost your hosting journey.</Typography>
          <Button variant="contained" color="primary" sx={mainStyle.button}>
            Get Started
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default Main;
