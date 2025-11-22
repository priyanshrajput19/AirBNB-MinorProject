import { Box, Typography, Button, Card, CardContent, CardMedia, Collapse, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState } from "react";
import { listingCardStyles } from "./ListingCard.styles";

interface Listing {
  id: string | null;
  listing_url: string | null;
  name: string | null;
  description: string | null;
  neighborhood_overview: string | null;
  picture_url: string | null;
  host_name: string | null;
  host_about: string | null;
  property_types: string | null;
  room_type: string | null;
  accomodations: number | null; // Note: API uses "accomodations" (serialization alias)
  price: number | null;
}

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleBookNow = () => {
    if (listing.listing_url) {
      window.open(listing.listing_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card sx={listingCardStyles.card}>
      {/* Image */}
      {listing.picture_url ? (
        <CardMedia
          component="img"
          height="200"
          image={listing.picture_url}
          alt={listing.name || "Listing image"}
          sx={listingCardStyles.image}
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=No+Image";
          }}
        />
      ) : (
        <Box sx={listingCardStyles.placeholderImage}>
          <Typography variant="body2" color="text.secondary">
            No Image Available
          </Typography>
        </Box>
      )}

      <CardContent sx={listingCardStyles.content}>
        {/* Name */}
        <Typography variant="h6" sx={listingCardStyles.name} gutterBottom>
          {listing.name || "Unnamed Listing"}
        </Typography>

        {/* Price */}
        {listing.price && (
          <Typography variant="body1" sx={listingCardStyles.price} gutterBottom>
            ${listing.price.toFixed(2)} / night
          </Typography>
        )}

        {/* Book Now Button */}
        <Button
          variant="contained"
          fullWidth
          sx={listingCardStyles.bookButton}
          onClick={handleBookNow}
          disabled={!listing.listing_url}
        >
          Book Now
        </Button>

        {/* Expand/Collapse Button */}
        <Box sx={listingCardStyles.expandButtonContainer}>
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            sx={listingCardStyles.expandButton}
          >
            <Typography variant="body2" sx={{ mr: 1, fontWeight: 600 }}>
              {expanded ? "Hide Details" : "Show Details"}
            </Typography>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {/* Expandable Details */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={listingCardStyles.detailsContainer}>
            {/* Description */}
            {listing.description && (
              <Box sx={listingCardStyles.detailSection}>
                <Typography variant="subtitle2" sx={listingCardStyles.detailLabel}>
                  Description
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {listing.description}
                </Typography>
              </Box>
            )}

            {/* Neighborhood Overview */}
            {listing.neighborhood_overview && (
              <Box sx={listingCardStyles.detailSection}>
                <Typography variant="subtitle2" sx={listingCardStyles.detailLabel}>
                  Neighborhood Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {listing.neighborhood_overview}
                </Typography>
              </Box>
            )}

            {/* Host Information */}
            {(listing.host_name || listing.host_about) && (
              <Box sx={listingCardStyles.detailSection}>
                <Typography variant="subtitle2" sx={listingCardStyles.detailLabel}>
                  Host Information
                </Typography>
                {listing.host_name && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Host:</strong> {listing.host_name}
                  </Typography>
                )}
                {listing.host_about && (
                  <Typography variant="body2" color="text.secondary">
                    {listing.host_about}
                  </Typography>
                )}
              </Box>
            )}

            {/* Property Details */}
            {(listing.property_types || listing.room_type || listing.accomodations) && (
              <Box sx={listingCardStyles.detailSection}>
                <Typography variant="subtitle2" sx={listingCardStyles.detailLabel}>
                  Property Details
                </Typography>
                {listing.property_types && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Property Type:</strong> {listing.property_types}
                  </Typography>
                )}
                {listing.room_type && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Room Type:</strong> {listing.room_type}
                  </Typography>
                )}
                {listing.accomodations && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Accommodates:</strong> {listing.accomodations} guests
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ListingCard;

