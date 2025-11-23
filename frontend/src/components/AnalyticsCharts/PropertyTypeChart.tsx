import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography, Chip, Stack } from "@mui/material";
import { useState } from "react";

interface PropertyTypeDistribution {
  property_type: string;
  count: number;
}

interface PropertyTypeChartProps {
  data: PropertyTypeDistribution[];
  onTypeClick?: (type: string, isProperty: boolean) => void;
}

const PropertyTypeChart = ({ data, onTypeClick }: PropertyTypeChartProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No property type data available
        </Typography>
      </Box>
    );
  }

  // Clean up labels to remove "Property:" and "Room:" prefixes for display
  const cleanLabel = (label: string) => {
    if (label.startsWith("Property: ")) {
      return label.replace("Property: ", "");
    }
    if (label.startsWith("Room: ")) {
      return label.replace("Room: ", "");
    }
    return label;
  };

  const chartData = data.map((item, index) => ({
    id: index,
    value: item.count,
    label: `${cleanLabel(item.property_type)} (${item.count} properties)`,
  }));

  const handleTypeClick = (item: PropertyTypeDistribution) => {
    const isProperty = item.property_type.startsWith("Property: ");
    const isRoom = item.property_type.startsWith("Room: ");
    setSelectedType(item.property_type);

    if (onTypeClick) {
      onTypeClick(item.property_type, isProperty && !isRoom);
    }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#FF5A5F", fontSize: "1.5rem" }}>
        Property & Room Type Distribution
      </Typography>

      {/* Clickable type labels */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 2,
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {data.map((item) => {
          const isSelected = selectedType === item.property_type;
          const isProperty = item.property_type.startsWith("Property: ");

          return (
            <Chip
              key={item.property_type}
              label={`${cleanLabel(item.property_type)} (${item.count})`}
              onClick={() => handleTypeClick(item)}
              sx={{
                cursor: "pointer",
                backgroundColor: isSelected ? "#FF5A5F" : isProperty ? "#e3f2fd" : "#f3e5f5",
                color: isSelected ? "#ffffff" : "#222222",
                fontWeight: isSelected ? 600 : 500,
                "&:hover": {
                  backgroundColor: isSelected ? "#FF4A4F" : isProperty ? "#bbdefb" : "#e1bee7",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
            />
          );
        })}
      </Stack>

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

      {selectedType && onTypeClick && (
        <Typography variant="body2" sx={{ mt: 2, color: "#FF5A5F", fontStyle: "italic" }}>
          Click a type above to filter listings
        </Typography>
      )}
    </Box>
  );
};

export default PropertyTypeChart;
