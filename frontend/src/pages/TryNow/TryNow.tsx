import { Box, Typography } from "@mui/material";
import SearchBar from "../../components/Searchbar/SearchBar";
import { tryNowStyles } from "./TryNow.styles";

const TryNow = () => {
  return (
    <>
      <Box sx={tryNowStyles.container}>
        <SearchBar />

        {/* Main Content Box with Analytics and Listings */}
        <Box sx={tryNowStyles.contentBox}>
          {/* Analytics Section - Takes more space */}
          <Box sx={tryNowStyles.analyticsSection}>
            <Typography sx={tryNowStyles.debugLabel} variant="h4" component="div">
              ANALYTICS DIV (Larger Space)
            </Typography>
            <Typography sx={tryNowStyles.debugText}>This section will contain charts and analytics data</Typography>
          </Box>

          {/* Listings Section - Scrollable, takes less space */}
          <Box sx={tryNowStyles.listingsSection}>
            <Typography sx={tryNowStyles.debugLabel} variant="h4" component="div">
              LISTINGS DIV (Scrollable)
            </Typography>
            <Typography sx={tryNowStyles.debugText}>This section will contain paginated listings</Typography>
            {/* Scrollable content area */}
            <Box sx={tryNowStyles.scrollableContent}>
              {Array.from({ length: 20 }, (_, i) => (
                <Box key={i} sx={tryNowStyles.debugItem}>
                  <Typography>Listing Item {i + 1}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TryNow;
