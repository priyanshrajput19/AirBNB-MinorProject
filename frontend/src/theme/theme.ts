import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5A5F",
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    button: { textTransform: "none" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
        contained: {
          backgroundColor: "#FF5A5F",
          color: "white",
          transition: "all 0.3s ease",
          transform: "scale(1)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, transparent 0%, transparent 30%, rgba(255,255,255,0.7) 50%, transparent 70%, transparent 100%)",
            animation: "reflection 8s ease-in-out infinite",
          },
          "&:hover": {
            backgroundColor: "#FF5A5F",
            transform: "scale(1.02)",
            boxShadow: "0 4px 15px rgba(255, 90, 95, 0.2)",
            "& .MuiButton-endIcon": {
              transform: "rotate(-45deg)",
              transition: "transform 0.3s ease",
            },
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        },
      },
    },
  },
});

export default theme;
