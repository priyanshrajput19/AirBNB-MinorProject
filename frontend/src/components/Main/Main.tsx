import { Box, Typography } from "@mui/material";
import { mainStyle } from "./main.style";

const Main = () => {
  return (
    <>
      <Box component="main" className="main ">
        <Typography sx={mainStyle}>One-stop solution for Airbnb insights. With real-time data and analytics.</Typography>
      </Box>
    </>
  );
};

export default Main;
