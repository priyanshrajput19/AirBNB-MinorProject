import { Box, CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Logo from "../../assets/icons/airbnb-icon.svg";
import { splashScreenStyles } from "./SplashScreen.styles";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [logoScale, setLogoScale] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Animate logo scale in
    const timer1 = setTimeout(() => {
      setLogoScale(1);
      setOpacity(1);
    }, 100);

    // Show loading content after logo appears
    const timer2 = setTimeout(() => {
      setShowContent(true);
    }, 600);

    // Complete splash screen after animation
    const timer3 = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => {
        onFinish();
      }, 500);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <Box
      sx={{
        ...splashScreenStyles.container,
        opacity,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      <Box sx={splashScreenStyles.content}>
        <Box
          component="img"
          src={Logo}
          alt="Airbnb Analytics Logo"
          sx={{
            ...splashScreenStyles.logo,
            transform: `scale(${logoScale})`,
            transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />

        {showContent && (
          <Box
            sx={{
              ...splashScreenStyles.loadingContainer,
              opacity: showContent ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
          >
            <CircularProgress size={40} thickness={4} sx={splashScreenStyles.spinner} />
            <Typography sx={splashScreenStyles.loadingText}>Loading...</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SplashScreen;
