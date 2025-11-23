import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Typography, Chip, Stack } from "@mui/material";
import { useState } from "react";

interface AmenityDistribution {
  amenity: string;
  count: number;
}

interface AmenityChartProps {
  data: AmenityDistribution[];
  country: string;
  province?: string | null;
  onAmenityClick?: (amenity: string) => void;
}

const AmenityChart = ({ data, country, province, onAmenityClick }: AmenityChartProps) => {
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No amenity data available
        </Typography>
      </Box>
    );
  }

  // Calculate total number of amenities (sum of all counts)
  const totalAmenities = data.reduce((sum, item) => sum + item.count, 0);

  // Count unique amenity types
  const uniqueAmenityCount = data.length;

  // Take top 10 amenities for better visualization
  const topAmenities = data.slice(0, 10);
  const amenityNames = topAmenities.map((item) => item.amenity);
  const amenityCounts = topAmenities.map((item) => item.count);

  // Build location text
  const locationText = province ? `${country} - ${province}` : country;

  const handleAmenityClick = (amenity: string) => {
    setSelectedAmenity(amenity);
    if (onAmenityClick) {
      onAmenityClick(amenity);
    }
  };

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Top Amenities
      </Typography>

      {/* Location and statistics text */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: "#222222" }}>
          Amenity Statistics for <strong>{locationText}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          • Total Amenity Instances: <strong>{totalAmenities.toLocaleString()}</strong> (across all listings)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Unique Amenity Types: <strong>{uniqueAmenityCount}</strong>
        </Typography>
      </Box>

      {/* Clickable amenity chips */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 3,
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {data.map((item) => {
          const isSelected = selectedAmenity === item.amenity;

          return (
            <Chip
              key={item.amenity}
              label={`${item.amenity} (${item.count})`}
              onClick={() => handleAmenityClick(item.amenity)}
              sx={{
                cursor: "pointer",
                backgroundColor: isSelected ? "#FF5A5F" : "#e8f5e9",
                color: isSelected ? "#ffffff" : "#222222",
                fontWeight: isSelected ? 600 : 500,
                "&:hover": {
                  backgroundColor: isSelected ? "#FF4A4F" : "#c8e6c9",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
            />
          );
        })}
      </Stack>

      <BarChart
        xAxis={[
          {
            id: "amenities",
            data: amenityNames,
            scaleType: "band",
          },
        ]}
        series={[
          {
            data: amenityCounts,
            color: "#FF5A5F",
          },
        ]}
        width={600}
        height={400}
        layout="vertical"
      />

      {selectedAmenity && onAmenityClick && (
        <Typography variant="body2" sx={{ mt: 2, color: "#FF5A5F", fontStyle: "italic", textAlign: "center" }}>
          Click an amenity above to filter listings
        </Typography>
      )}
    </Box>
  );
};

export default AmenityChart;
