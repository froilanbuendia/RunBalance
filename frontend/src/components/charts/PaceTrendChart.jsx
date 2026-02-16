import { Line } from "react-chartjs-2";

const PaceTrendChart = ({ paceData }) => {
  if (!paceData || paceData.length === 0) return null;

  const paceToSeconds = (pace) => {
    if (!pace || pace === "00:00") return null;
    const [min, sec] = pace.split(":").map(Number);
    return min * 60 + sec;
  };

  const labels = paceData.map((w) =>
    new Date(w.week).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  );

  const paceSeconds = paceData.map((w) => paceToSeconds(w.avg_pace));

  const data = {
    labels,
    datasets: [
      {
        label: "Avg Pace (min/mile)",
        data: paceSeconds,
        // borderWidth: 2,
        // tension: 0.3,
        spanGaps: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Weekly Pace Trend",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => {
            const min = Math.floor(value / 60);
            const sec = Math.round(value % 60);
            return `${min}:${sec.toString().padStart(2, "0")}`;
          },
        },
        title: {
          display: true,
          text: "Pace (min/mile)",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default PaceTrendChart;
