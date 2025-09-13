export const landingPageStyles = {
  tagline: {
    font: "var(--font-primary)",
    fontWeight: "800",
  },
  main: {
    paddingTop: "106px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "80vh",
    width: "100%",
    textAlign: "center",
    padding: "200px 20px 0",
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
