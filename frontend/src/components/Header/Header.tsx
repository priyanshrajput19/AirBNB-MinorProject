import { Box, Button } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useState } from "react";
import Logo from "../../assets/icons/airbnb-icon.svg";
import { headerStyles } from "./header.styles";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <>
      <Box component="header" sx={headerStyles.header}>
        <Box sx={headerStyles.headerInner}>
          {/* Left: Logo */}
          <Box sx={headerStyles.headerLogo}>
            <a href="#home">
              <img src={Logo} alt="Logo" style={headerStyles.img}></img>
            </a>
          </Box>

          {/* Center: Navigation */}
          <Box sx={headerStyles.headerMenu}>
            <ul style={headerStyles.navigationList}>
              <li>
                <Box component="a" href="#home" sx={headerStyles.navigationLink}>
                  Home
                </Box>
              </li>
              <li>
                <Box component="a" href="#features" sx={headerStyles.navigationLink}>
                  Features
                </Box>
              </li>
              <li>
                <Button onClick={() => navigate("/try-now")} sx={headerStyles.navigationLink}>
                  Try Now
                </Button>
              </li>
            </ul>
          </Box>

          {/* Right: Theme Toggle */}
          <Button onClick={handleToggleDarkMode}>{isDarkMode ? <LightMode color="disabled" fontSize="small" /> : <DarkMode color="disabled" fontSize="small" />}</Button>
        </Box>
      </Box>
    </>
  );
};

export default Header;
