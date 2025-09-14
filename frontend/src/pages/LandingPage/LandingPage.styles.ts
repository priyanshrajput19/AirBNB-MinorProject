export const landingPageStyles = {
  tagline: {
    font: "var(--font-primary)",
    fontWeight: "800",
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
    font: "var(--font-primary)",
    fontSize: "16px",
    color: "var(--color-primary)",
  },
  button: {
    marginTop: "20px",
    fontSize: "16px",
    font: "var(--font-primary)",
    width: "180px",
    alignSelf: "center",
    padding: "12px 24px",
    gap: "4px",
    "& .MuiButton-endIcon": {
      marginLeft: "4px",
    },
  },
};
