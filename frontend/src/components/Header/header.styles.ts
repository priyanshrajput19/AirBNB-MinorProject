export const headerStyles = {
  header: {
    display: "flex",
    top: 0,
    left: 0,
    padding: "25px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "0 auto",
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
    "&:hover": {
      color: "#ffffff",
      backgroundColor: "#f45b60",
      boxShadow: "0 4px 15px rgba(244, 91, 96, 0.3)",
    },
  },
  img: {
    width: "auto",
    height: "55px",
  },
};
