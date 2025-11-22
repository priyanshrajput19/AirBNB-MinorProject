export const listingCardStyles = {
  card: {
    marginBottom: "16px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
      transform: "translateY(-2px)",
    },
    overflow: "hidden",
  },
  image: {
    objectFit: "cover",
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  placeholderImage: {
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: "16px",
  },
  name: {
    fontWeight: 600,
    color: "#222222",
    marginBottom: "8px",
    lineHeight: 1.3,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  price: {
    fontWeight: 600,
    color: "#FF5A5F",
    marginBottom: "12px",
  },
  bookButton: {
    backgroundColor: "#FF5A5F",
    color: "#ffffff",
    fontWeight: 600,
    textTransform: "none",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#FF4A4F",
    },
    "&:disabled": {
      backgroundColor: "#cccccc",
      color: "#666666",
    },
  },
  expandButtonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    borderTop: "1px solid #e8e8e8",
    paddingTop: "8px",
  },
  expandButton: {
    color: "#FF5A5F",
    padding: "4px 8px",
    "&:hover": {
      backgroundColor: "rgba(255, 90, 95, 0.1)",
    },
  },
  detailsContainer: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #e8e8e8",
  },
  detailSection: {
    marginBottom: "16px",
    "&:last-child": {
      marginBottom: 0,
    },
  },
  detailLabel: {
    fontWeight: 600,
    color: "#222222",
    marginBottom: "8px",
    textTransform: "uppercase",
    fontSize: "0.75rem",
    letterSpacing: "0.5px",
  },
};

