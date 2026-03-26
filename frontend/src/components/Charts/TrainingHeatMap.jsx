import CalendarHeatmap from "react-calendar-heatmap";
import "./heatmap.css";

const TrainingHeatmap = ({ runs, heatmap }) => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // Define reasonable max values for scaling per metric
  const getMaxValue = () => {
    switch (heatmap) {
      case "distance":
        return 10; // mi per day
      case "effort":
        return 200; // max effort rating
      case "elevation":
        return 200; // meters
      default:
        return 1;
    }
  };

  const maxValue = getMaxValue();

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <CalendarHeatmap
      startDate={oneYearAgo}
      endDate={today}
      values={runs}
      classForValue={(value) => {
        if (!value || value.count == null) return "color-empty";

        let intensity = value.count;

        // Log scaling for elevation to reduce outlier effect
        if (heatmap === "elevation") {
          intensity = Math.log1p(intensity);
          const maxLog = Math.log1p(maxValue);
          intensity = Math.min(intensity / maxLog, 1);
        } else {
          intensity = Math.min(intensity / maxValue, 1);
        }

        if (intensity === 0) return "color-empty";
        if (intensity < 0.25) return "color-scale-1";
        if (intensity < 0.5) return "color-scale-2";
        if (intensity < 0.75) return "color-scale-3";
        return "color-scale-4";
      }}
      tooltipDataAttrs={(value) => {
        if (!value || value.count == null) return {};
        const unit =
          heatmap === "distance" ? "mi" : heatmap === "elevation" ? "m" : "";
        return {
          "data-tooltip-id": "heatmap-tooltip",
          "data-tooltip-content": `${formatDate(value.date)}: ${value.count.toFixed(
            2,
          )} ${unit}`,
        };
      }}
    />
  );
};

export default TrainingHeatmap;
