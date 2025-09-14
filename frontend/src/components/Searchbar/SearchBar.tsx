import { Box } from "@mui/material";
import { searchBarStyles } from "./SearchBar.styles";

const SearchBar = () => {
  return (
    <>
      <Box className="search-bar-box-container" sx={searchBarStyles.searchBarBoxContainer}>
        <Box className="search-bar-box" sx={searchBarStyles.searchBarBox}></Box>
      </Box>
    </>
  );
};

export default SearchBar;
