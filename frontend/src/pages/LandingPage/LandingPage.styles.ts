export const landingPageStyles = {
  tagline: {
    fontWeight: "800",
    fontFamily: "'Montserrat', sans-serif",
  },
  main: {
    padding: "50px",
    margin: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    textAlign: "center",
  },
  content: {
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto",
  },
  paragraph: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "16px",
    color: "var(--color-primary)",
  },
  button: {
    marginTop: "20px",
    fontSize: "16px",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: "700",
    width: "180px",
    alignSelf: "center",
    padding: "12px 24px",
    gap: "4px",
    "& .MuiButton-endIcon": {
      marginLeft: "4px",
    },
  },
};
