import { Box, Typography, Card, CardContent } from "@mui/material";
import ReviewsIcon from "@mui/icons-material/Reviews";

interface ReviewStatistics {
  total: number;
  average: number;
  max: number;
  min: number;
}

interface ReviewStatisticsCardsProps {
  data: ReviewStatistics;
}

const ReviewStatisticsCards = ({ data }: ReviewStatisticsCardsProps) => {
  const formatReview = (value: number) => {
    if (isNaN(value)) return "N/A";
    return value.toFixed(0);
  };

  const stats = [
    { label: "Total Reviews", value: formatReview(data.total), icon: <ReviewsIcon /> },
    { label: "Average Reviews", value: formatReview(data.average), icon: <ReviewsIcon /> },
    { label: "Max Reviews", value: formatReview(data.max), icon: <ReviewsIcon /> },
    { label: "Min Reviews", value: formatReview(data.min), icon: <ReviewsIcon /> },
  ];

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Review Statistics
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

export default ReviewStatisticsCards;

