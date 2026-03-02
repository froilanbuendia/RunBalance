import { Line } from "react-chartjs-2";

const MileageChart = ({ weeklyMileage }) => {
  if (!weeklyMileage || weeklyMileage.length === 0) return null;
  console.log(weeklyMileage);
  const labels = weeklyMileage.map((w) =>
    new Date(w.week).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  );

  const data = {
    labels: labels,
    plugins: {
      title: {
        display: true,
        text: "Weekly Pace Trend",
      },
    },
    datasets: [
      {
        label: "Weekly Mileage",
        data: weeklyMileage.map((w) => w.miles),
      },
    ],
    scales: {
      y: {
        title: {
          display: true,
          text: "Miles in a Week",
        },
      },
    },
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Weekly Mileage",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Miles",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default MileageChart;
