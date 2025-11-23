import { Box, Typography, Card, CardContent } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AssessmentIcon from "@mui/icons-material/Assessment";

interface PriceStatistics {
  average: number;
  highest: number;
  lowest: number;
  median: number | null;
}

interface PriceStatisticsCardsProps {
  data: PriceStatistics;
}

const PriceStatisticsCards = ({ data }: PriceStatisticsCardsProps) => {
  const formatPrice = (value: number | null) => {
    if (value === null || isNaN(value)) return "N/A";
    return `$${value.toFixed(2)}`;
  };

  const stats = [
    { label: "Average Price", value: formatPrice(data.average), icon: <AssessmentIcon /> },
    { label: "Median Price", value: formatPrice(data.median), icon: <AttachMoneyIcon /> },
    { label: "Highest Price", value: formatPrice(data.highest), icon: <TrendingUpIcon /> },
    { label: "Lowest Price", value: formatPrice(data.lowest), icon: <TrendingDownIcon /> },
  ];

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Price Statistics
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {stats.map((stat, index) => (
          <Box key={index} sx={{ flex: "1 1 45%", minWidth: "250px" }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {stat.icon}
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {stat.label}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: "#FF5A5F" }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PriceStatisticsCards;

