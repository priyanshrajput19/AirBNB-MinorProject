export const headerStyles = {
  header: {
    display: "flex",
    padding: "25px 0",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "inset 0 -3px 8px rgba(0, 0, 0, 0.08)",
    background: "linear-gradient(to bottom, #fafafa, #ffffff)",
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "auto",
    maxWidth: "80rem",
    width: "100%",
  },
  headerLogo: {
    // Logo container styles
  },
  headerMenu: {
    // Navigation container styles
  },
  navigationList: {
    display: "flex",
    alignItems: "center",
    gap: "2.5rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navigationLink: {
    textDecoration: "none",
    color: "#000",
    fontSize: "16px",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    font: "'Montserrat', sans-serif",
    fontFamily: "'Montserrat', sans-serif",
    textTransform: "none",
    fontWeight: "400",
    "&:hover": {
      color: "#ffffff",
      backgroundColor: "#FF5A5F",
      boxShadow: "0 4px 15px rgba(255, 90, 95, 0.3)",
    },
  },
  img: {
    width: "auto",
    height: "55px",
  },
};
