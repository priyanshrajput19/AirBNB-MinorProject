import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Typography } from "@mui/material";

interface AmenityDistribution {
  amenity: string;
  count: number;
}

interface AmenityChartProps {
  data: AmenityDistribution[];
}

const AmenityChart = ({ data }: AmenityChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No amenity data available
        </Typography>
      </Box>
    );
  }

  // Take top 10 amenities for better visualization
  const topAmenities = data.slice(0, 10);
  const amenityNames = topAmenities.map((item) => item.amenity);
  const amenityCounts = topAmenities.map((item) => item.count);

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Top Amenities
      </Typography>
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
    </Box>
  );
};

export default AmenityChart;
