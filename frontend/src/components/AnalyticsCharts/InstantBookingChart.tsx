import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";

interface InstantBookingStats {
  instant_booking_enabled: number;
  instant_booking_disabled: number;
  total: number;
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
      label: "Enabled",
    },
    {
      id: 1,
      value: data.instant_booking_disabled,
      label: "Disabled",
    },
  ];

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Instant Booking Status
      </Typography>
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
  );
};

export default InstantBookingChart;

