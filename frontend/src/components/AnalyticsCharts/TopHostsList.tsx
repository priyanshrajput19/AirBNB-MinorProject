import { Box, Typography, Card, CardContent, List, ListItem, Chip, Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useState } from "react";

interface TopHost {
  host_id: string | null;
  host_name: string | null;
  host_location: string | null;
  host_since: string | null;
  host_about: string | null;
  host_identity_verified: boolean | null;
  total_listings_count: number;
  host_url: string | null;
  host_picture_url: string | null;
}

interface TopHostsListProps {
  data: TopHost[];
}

const TopHostsList = ({ data }: TopHostsListProps) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No host data available
        </Typography>
      </Box>
    );
  }

  // Helper function to get initials from name
  const getInitials = (name: string | null): string => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Helper function to handle click and redirect
  const handleHostClick = (hostUrl: string | null) => {
    if (hostUrl) {
      window.open(hostUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Avatar component with error handling
  const HostAvatar = ({ host }: { host: TopHost }) => {
    const [imageError, setImageError] = useState(false);
    const hasPicture = host.host_picture_url && host.host_picture_url.trim() !== "" && !imageError;

    return (
      <Avatar
        src={hasPicture ? host.host_picture_url || undefined : undefined}
        alt={host.host_name || "Host"}
        onError={() => setImageError(true)}
        sx={{
          width: 64,
          height: 64,
          bgcolor: "#FF5A5F",
          fontSize: "1.5rem",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {!hasPicture && getInitials(host.host_name)}
      </Avatar>
    );
  };

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Top 10 Hosts
      </Typography>
      <List sx={{ width: "100%" }}>
        {data.map((host, index) => (
          <ListItem
            key={host.host_id || index}
            sx={{
              mb: 1,
              p: 0,
            }}
          >
            <Card
              sx={{
                width: "100%",
                cursor: host.host_url ? "pointer" : "default",
                transition: "all 0.3s ease",
                "&:hover": host.host_url
                  ? {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(255, 90, 95, 0.2)",
                    }
                  : {},
              }}
              onClick={() => handleHostClick(host.host_url)}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  {/* Host Avatar */}
                  <HostAvatar host={host} />

                  {/* Host Details */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {host.host_name || "Unknown Host"}
                      </Typography>
                      {host.host_identity_verified && (
                        <Chip
                          icon={<VerifiedUserIcon />}
                          label="Verified"
                          size="small"
                          sx={{ backgroundColor: "rgba(76, 175, 80, 0.1)", color: "#4CAF50" }}
                        />
                      )}
                    </Box>
                    {host.host_location && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        📍 {host.host_location}
                      </Typography>
                    )}
                    {host.host_about && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {host.host_about.length > 100 ? `${host.host_about.substring(0, 100)}...` : host.host_about}
                      </Typography>
                    )}
                  </Box>

                  {/* Listings Count */}
                  <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                    <Typography variant="h6" sx={{ color: "#FF5A5F", fontWeight: 600 }}>
                      {host.total_listings_count}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Listings
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TopHostsList;

