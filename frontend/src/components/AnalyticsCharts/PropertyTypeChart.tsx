import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";

interface PropertyTypeDistribution {
  property_type: string;
  count: number;
}

interface PropertyTypeChartProps {
  data: PropertyTypeDistribution[];
}

const PropertyTypeChart = ({ data }: PropertyTypeChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No property type data available
        </Typography>
      </Box>
    );
  }

  const chartData = data.map((item, index) => ({
    id: index,
    value: item.count,
    label: `${item.property_type} (${item.count} properties)`,
  }));

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#FF5A5F", fontSize: "1.5rem" }}>
        Property Type Distribution
      </Typography>
      <PieChart
        series={[
          {
            data: chartData,
            innerRadius: 40,
            outerRadius: 120,
            paddingAngle: 3,
            cornerRadius: 8,
            cx: 200,
            cy: 180,
          },
        ]}
        width={500}
        height={400}
        slotProps={{
          legend: {
            position: { vertical: "top", horizontal: "center" },
          },
        }}
      />
    </Box>
  );
};

export default PropertyTypeChart;
