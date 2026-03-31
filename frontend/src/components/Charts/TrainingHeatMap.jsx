import CalendarHeatmap from "react-calendar-heatmap";
import "./heatmap.css";

const SCALES = ["empty", "1", "2", "3", "4"];

const UNITS = {
  distance: "mi",
  elevation: "m",
  effort: "pts",
};

const Legend = ({ metric }) => (
  <div className="heatmap-legend" data-metric={metric}>
    <span className="heatmap-legend-label">Less</span>
    {SCALES.map((s) => (
      <span key={s} className={`legend-swatch scale-${s}`} />
    ))}
    <span className="heatmap-legend-label">More</span>
  </div>
);

const TrainingHeatmap = ({ runs, heatmap }) => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const maxValue =
    runs && runs.length > 0
      ? Math.max(...runs.map((r) => r.count ?? 0), 1)
      : 1;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (!runs || runs.length === 0)
    return (
      <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
        No activity data yet
      </p>
    );

  return (
    <div className={`heatmap-${heatmap}`}>
      <div className="heatmap-svg-wrapper">
      <CalendarHeatmap
        startDate={oneYearAgo}
        endDate={today}
        values={runs}
        showWeekdayLabels
        classForValue={(value) => {
          if (!value || value.count == null) return "color-empty";

          let intensity;
          if (heatmap === "elevation") {
            intensity = Math.min(Math.log1p(value.count) / Math.log1p(maxValue), 1);
          } else {
            intensity = Math.min(value.count / maxValue, 1);
          }

          if (intensity === 0) return "color-empty";
          if (intensity < 0.25) return "color-scale-1";
          if (intensity < 0.5)  return "color-scale-2";
          if (intensity < 0.75) return "color-scale-3";
          return "color-scale-4";
        }}
        tooltipDataAttrs={(value) => {
          if (!value || value.count == null) return {};
          const unit = UNITS[heatmap] ?? "";
          return {
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-content": `${formatDate(value.date)}: ${value.count.toFixed(1)} ${unit}`,
          };
        }}
      />
      </div>
      <Legend metric={heatmap} />
    </div>
  );
};

export default TrainingHeatmap;