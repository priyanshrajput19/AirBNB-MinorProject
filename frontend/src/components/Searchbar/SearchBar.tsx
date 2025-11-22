import { Box, Typography, Button, Select, MenuItem, FormControl, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { searchBarStyles } from "./SearchBar.styles";

interface SearchBarProps {
  onSearch?: (country: string, province: string) => void;
}

const API_BASE_URL = "http://localhost:8000/api/v1";

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [countries, setCountries] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [loadingCountries, setLoadingCountries] = useState<boolean>(false);
  const [loadingProvinces, setLoadingProvinces] = useState<boolean>(false);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch(`${API_BASE_URL}/listings/countries`);
        if (response.ok) {
          const data = await response.json();
          setCountries(data.countries || []);
        } else {
          console.error("Failed to fetch countries");
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch provinces when country is selected
  useEffect(() => {
    if (selectedCountry) {
      const fetchProvinces = async () => {
        setLoadingProvinces(true);
        setSelectedProvince(""); // Reset province when country changes
        try {
          const response = await fetch(`${API_BASE_URL}/listings/provinces?country=${encodeURIComponent(selectedCountry)}`);
          if (response.ok) {
            const data = await response.json();
            setProvinces(data.provinces || []);
          } else {
            console.error("Failed to fetch provinces");
            setProvinces([]);
          }
        } catch (error) {
          console.error("Error fetching provinces:", error);
          setProvinces([]);
        } finally {
          setLoadingProvinces(false);
        }
      };

      fetchProvinces();
    } else {
      setProvinces([]);
      setSelectedProvince("");
    }
  }, [selectedCountry]);

  const handleSearch = () => {
    if (selectedCountry && onSearch) {
      onSearch(selectedCountry, selectedProvince || "");
    }
  };

  const isSearchDisabled = !selectedCountry || loadingProvinces;

  return (
    <>
      <Box className="search-bar-container" sx={searchBarStyles.searchBarContainer}>
        <Box className="search-bar" sx={searchBarStyles.searchBar}>
          {/* Country Section */}
          <Box sx={searchBarStyles.whereSection}>
            <Typography sx={searchBarStyles.label}>Country</Typography>
            <FormControl
              fullWidth
              variant="standard"
              sx={{
                marginTop: "4px",
                "& .MuiInput-underline:before": { borderBottom: "none" },
                "& .MuiInput-underline:after": { borderBottom: "none" },
                "&:hover .MuiInput-underline:before": { borderBottom: "none" },
              }}
            >
              <Select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                displayEmpty
                sx={searchBarStyles.select}
                renderValue={(selected) => {
                  if (!selected) {
                    return <Typography sx={searchBarStyles.placeholder}>Select country</Typography>;
                  }
                  return <Typography sx={{ fontSize: "14px", color: "#222222" }}>{selected}</Typography>;
                }}
              >
                {loadingCountries ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : countries.length === 0 ? (
                  <MenuItem disabled>No countries available</MenuItem>
                ) : (
                  countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>

          {/* Divider */}
          <Box sx={searchBarStyles.divider}></Box>

          {/* Province Section */}
          <Box sx={searchBarStyles.inputSection}>
            <Typography sx={searchBarStyles.label}>Province (Optional)</Typography>
            <FormControl
              fullWidth
              variant="standard"
              disabled={!selectedCountry || loadingProvinces}
              sx={{
                marginTop: "4px",
                "& .MuiInput-underline:before": { borderBottom: "none" },
                "& .MuiInput-underline:after": { borderBottom: "none" },
                "&:hover .MuiInput-underline:before": { borderBottom: "none" },
              }}
            >
              <Select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                displayEmpty
                disabled={!selectedCountry || loadingProvinces}
                sx={searchBarStyles.select}
                renderValue={(selected) => {
                  if (!selected) {
                    return <Typography sx={searchBarStyles.placeholder}>{!selectedCountry ? "Select country first" : loadingProvinces ? "Loading..." : "Province (optional)"}</Typography>;
                  }
                  return <Typography sx={{ fontSize: "14px", color: "#222222" }}>{selected}</Typography>;
                }}
              >
                {loadingProvinces ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : provinces.length === 0 && selectedCountry ? (
                  <MenuItem disabled>No provinces available</MenuItem>
                ) : (
                  provinces.map((province) => (
                    <MenuItem key={province} value={province}>
                      {province}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>

          {/* Search Button */}
          <Button sx={searchBarStyles.searchButton} onClick={handleSearch} disabled={isSearchDisabled}>
            <SearchIcon sx={{ color: "#ffffff", fontSize: "20px" }} />
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SearchBar;
