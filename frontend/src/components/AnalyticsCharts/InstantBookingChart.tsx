import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

interface InstantBookingListing {
  name: string;
  id: string | null;
}

interface InstantBookingStats {
  instant_booking_enabled: number;
  instant_booking_disabled: number;
  total: number;
  enabled_listings: InstantBookingListing[];
}

interface InstantBookingChartProps {
  data: InstantBookingStats;
}

const InstantBookingChart = ({ data }: InstantBookingChartProps) => {
  if (data.total === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No instant booking data available
        </Typography>
      </Box>
    );
  }

  const chartData = [
    {
      id: 0,
      value: data.instant_booking_enabled,
      label: `Enabled (${data.instant_booking_enabled})`,
    },
    {
      id: 1,
      value: data.instant_booking_disabled,
      label: `Disabled (${data.instant_booking_disabled})`,
    },
  ];

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Instant Booking Status
      </Typography>
      
      {/* Pie Chart */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <PieChart
          series={[
            {
              data: chartData,
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 2,
              cornerRadius: 5,
              cx: 150,
              cy: 150,
            },
          ]}
          width={400}
          height={300}
        />
      </Box>

      {/* List of listings with instant booking enabled */}
      {data.enabled_listings && data.enabled_listings.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "#222222" }}>
            Listings with Instant Booking Enabled ({data.enabled_listings.length})
          </Typography>
          <Box
            sx={{
              maxHeight: "400px",
              overflowY: "auto",
              backgroundColor: "#fafafa",
              borderRadius: "8px",
              padding: "8px",
              border: "1px solid #e8e8e8",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "4px",
                "&:hover": {
                  background: "#555",
                },
              },
            }}
          >
            <List dense>
              {data.enabled_listings.map((listing, index) => (
                <ListItem
                  key={listing.id || index}
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "4px",
                    mb: 0.5,
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <ListItemText
                    primary={listing.name}
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: { fontWeight: 500, color: "#222222" },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InstantBookingChart;

