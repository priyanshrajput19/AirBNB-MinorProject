import { Box, Button } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import Logo from "../../assets/icons/airbnb-icon.svg";
import { headerStyles } from "./header.styles";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const featuresElement = document.getElementById("features");

      // Check if we're at the top of the page or at a section
      const isAtTop = currentScrollY <= 50;
      const isAtFeatures = featuresElement && currentScrollY >= featuresElement.offsetTop - 100 && currentScrollY <= featuresElement.offsetTop + featuresElement.offsetHeight;

      // Show header if at top, at features section, or scrolling up
      if (isAtTop || isAtFeatures) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past initial threshold - hide header
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // Already on home page, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const handleFeaturesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // Already on home page, scroll to features section
      const featuresElement = document.getElementById("features");
      if (featuresElement) {
        featuresElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Navigate to home first, then scroll to features
      navigate("/");
      setTimeout(() => {
        const featuresElement = document.getElementById("features");
        if (featuresElement) {
          featuresElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  const handleTryNowClick = () => {
    navigate("/try-now");
  };

  return (
    <>
      <Box
        ref={headerRef}
        component="header"
        sx={{
          ...headerStyles.header,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.5s ease-in-out",
          opacity: isVisible ? 1 : 0,
          boxShadow: isVisible ? "inset 0 -3px 8px rgba(0, 0, 0, 0.08)" : "none",
        }}
      >
        <Box sx={headerStyles.headerInner}>
          {/* Left: Logo */}
          <Box sx={headerStyles.headerLogo}>
            <Box
              component="button"
              onClick={handleHomeClick}
              sx={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              <img src={Logo} alt="Logo" style={headerStyles.img}></img>
            </Box>
          </Box>

          {/* Center: Navigation */}
          <Box sx={headerStyles.headerMenu}>
            <ul style={headerStyles.navigationList}>
              <li>
                <Button onClick={handleHomeClick} sx={headerStyles.navigationLink}>
                  Home
                </Button>
              </li>
              <li>
                <Button onClick={handleFeaturesClick} sx={headerStyles.navigationLink}>
                  Features
                </Button>
              </li>
              <li>
                <Button onClick={handleTryNowClick} sx={headerStyles.navigationLink}>
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
