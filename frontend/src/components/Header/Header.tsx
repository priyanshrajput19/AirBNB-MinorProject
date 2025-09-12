import { Box, Button } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useState } from "react";
import Logo from "../../assets/icons/airbnb-icon.svg";
import { headerStyles } from "./header.styles";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <>
      <Box component="header" className="header  top-0 left-0 py-[25px] border-b border-gray-200 ">
        <Box className="header-inner flex justify-between items-center mx-auto max-w-7xl">
          <Box className="header-logo">
            <a href="#home">
              <img src={Logo} alt="Logo" style={headerStyles.img}></img>
            </a>
          </Box>
          <Box className="header-menu relative">
            <ul className="flex  items-center gap-10">
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">Features</a>
              </li>
              <li>
                <a href="#contact">About</a>
              </li>
            </ul>
          </Box>
          <Box className="headertheme-toggle">
            <Button onClick={handleToggleDarkMode}> {isDarkMode ? <LightMode color="disabled" fontSize="small" /> : <DarkMode color="disabled" fontSize="small" />} </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Header;
