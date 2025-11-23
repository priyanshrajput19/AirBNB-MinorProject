import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import theme from "./theme/theme";
import { Route, Routes, useLocation } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import TryNow from "./pages/TryNow/TryNow";
import SplashScreen from "./components/SplashScreen/SplashScreen";

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if splash screen was already shown (stored in sessionStorage)
    const splashShown = sessionStorage.getItem("splashShown");

    if (splashShown) {
      setShowSplash(false);
    } else {
      // After splash completes, mark it as shown
      const timer = setTimeout(() => {
        sessionStorage.setItem("splashShown", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <Box
        sx={{
          opacity: showSplash ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
          pointerEvents: showSplash ? "none" : "auto",
          position: "relative",
          zIndex: 1,
          width: "100%",
        }}
      >
        <Header />
        <Box
          component="main"
          sx={{
            paddingTop: "90px", // Space for fixed header (25px top + 25px bottom + ~40px content)
            minHeight: "calc(100vh - 90px)",
            animation: showSplash ? "none" : "fadeInUp 0.8s ease-out",
            position: "relative",
            zIndex: 1,
            width: "100%",
          }}
        >
          <Routes key={location.pathname}>
            <Route path="/" element={<Main />} />
            <Route path="/try-now" element={<TryNow />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename="/">
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
