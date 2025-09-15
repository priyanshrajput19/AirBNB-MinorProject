import { Box, Typography, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { searchBarStyles } from "./SearchBar.styles";

const SearchBar = () => {
  return (
    <>
      <Box className="search-bar-container" sx={searchBarStyles.searchBarContainer}>
        <Box className="search-bar" sx={searchBarStyles.searchBar}>
          {/* Where Section */}
          <Box sx={searchBarStyles.whereSection}>
            <Typography sx={searchBarStyles.label}>Where</Typography>
            <Typography sx={searchBarStyles.placeholder}>Search destinations</Typography>
          </Box>

          {/* Divider */}
          <Box sx={searchBarStyles.divider}></Box>

          {/* Check in Section */}
          <Box sx={searchBarStyles.inputSection}>
            <Typography sx={searchBarStyles.label}>Check in</Typography>
            <Typography sx={searchBarStyles.placeholder}>Add dates</Typography>
          </Box>

          {/* Divider */}
          <Box sx={searchBarStyles.divider}></Box>

          {/* Check out Section */}
          <Box sx={searchBarStyles.inputSection}>
            <Typography sx={searchBarStyles.label}>Check out</Typography>
            <Typography sx={searchBarStyles.placeholder}>Add dates</Typography>
          </Box>

          {/* Divider */}
          <Box sx={searchBarStyles.divider}></Box>

          {/* Who Section */}
          <Box sx={searchBarStyles.inputSection}>
            <Typography sx={searchBarStyles.label}>Who</Typography>
            <Typography sx={searchBarStyles.placeholder}>Add guests</Typography>
          </Box>

          {/* Search Button */}
          <Button sx={searchBarStyles.searchButton}>
            <SearchIcon sx={{ color: "#ffffff", fontSize: "20px" }} />
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SearchBar;
