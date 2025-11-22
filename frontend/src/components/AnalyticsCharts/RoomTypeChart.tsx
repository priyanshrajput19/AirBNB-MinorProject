import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";

interface RoomTypeDistribution {
  room_type: string;
  count: number;
}

interface RoomTypeChartProps {
  data: RoomTypeDistribution[];
}

const RoomTypeChart = ({ data }: RoomTypeChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No room type data available
        </Typography>
      </Box>
    );
  }

  const chartData = data.map((item, index) => ({
    id: index,
    value: item.count,
    label: item.room_type,
  }));

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#FF5A5F", fontSize: "1.5rem" }}>
        Room Type Distribution
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
            position: { vertical: "bottom", horizontal: "center" },
          },
        }}
      />
    </Box>
  );
};

export default RoomTypeChart;
