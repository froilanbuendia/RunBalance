import { Line } from "react-chartjs-2";

const PaceTrendChart = ({ paceData }) => {
  if (!paceData || paceData.length === 0) return null;

  const secondsToPace = (seconds) => {
    if (!seconds || seconds <= 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const labels = paceData.map((w) =>
    new Date(w.day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  );

  const paceSeconds = paceData.map((w) => w.seconds_per_mile ?? null);

  const data = {
    labels,
    datasets: [
      {
        label: "Avg Pace",
        data: paceSeconds,
        spanGaps: true,
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const seconds = context.raw;
            return `Pace: ${secondsToPace(seconds)}`;
          },
        },
      },
      title: {
        display: true,
        text: "Pace Trend (Rolling 84 Days)",
      },
    },
    scales: {
      y: {
        reverse: true,
        ticks: {
          callback: (value) => secondsToPace(value),
        },
        title: {
          display: true,
          text: "Pace (min/mile)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default PaceTrendChart;
