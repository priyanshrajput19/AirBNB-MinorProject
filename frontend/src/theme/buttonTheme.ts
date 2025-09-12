import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f45b60",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
        contained: {
          backgroundColor: "#f45b60",
          color: "white",
          transition: "all 0.3s ease",
          transform: "scale(1)",
          "&:hover": {
            backgroundColor: "#f45b60",
            transform: "scale(1.02)",
            boxShadow: "0 4px 15px rgba(244, 91, 96, 0.2)",
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
