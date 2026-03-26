import { Bar } from "react-chartjs-2";

const MileageChart = ({ weeklyMileage }) => {
  if (!weeklyMileage || weeklyMileage.length === 0) return null;

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
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        suggestedMax: Math.max(...miles) * 1.2,
        title: {
          display: true,
          text: "Miles",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MileageChart;
