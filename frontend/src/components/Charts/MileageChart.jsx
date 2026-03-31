import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { getChartColors } from "../../utils/chartTheme";

const MileageChart = ({ weeklyMileage }) => {
  const colors = useMemo(() => getChartColors(), []);

  if (!weeklyMileage || weeklyMileage.length === 0)
    return (
      <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
        No data for this period
      </p>
    );

  const labels = weeklyMileage.map((w) =>
    new Date(w.week).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  );

  const miles = weeklyMileage.map((w) => Number(w.miles.toFixed(1)));

  const data = {
    labels,
    datasets: [
      {
        label: "Weekly Mileage",
        data: miles,
        backgroundColor: colors.primaryFill,
        borderColor: colors.primary,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: "start",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw} mi`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        suggestedMax: Math.max(...miles) * 1.2,
        ticks: { color: colors.textMuted },
        grid: { color: colors.borderMuted },
        title: {
          display: true,
          text: "Miles",
          color: colors.textMuted,
        },
      },
      x: {
        ticks: { color: colors.textMuted },
        grid: { display: false },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MileageChart;