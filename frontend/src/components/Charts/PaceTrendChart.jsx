import { useMemo } from "react";
import { Line } from "react-chartjs-2";

const PaceTrendChart = ({ paceData }) => {
  const dataArray = paceData || [];

  // Convert seconds to mm:ss
  const secondsToPace = (seconds) => {
    if (!seconds || seconds <= 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Sort data by week
  const sortedData = useMemo(() => {
    return [...dataArray].sort((a, b) => new Date(a.week) - new Date(b.week));
  }, [dataArray]);

  // Generate full week list
  const weekTimestamps = useMemo(() => {
    if (sortedData.length === 0) return [];

    const weeks = [];
    const start = new Date(sortedData[0].week);
    const end = new Date(sortedData[sortedData.length - 1].week);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
      weeks.push(d.getTime());
    }

    return weeks;
  }, [sortedData]);

  // Pace values aligned to full week list
  const paceSeconds = useMemo(() => {
    return weekTimestamps.map((ts) => {
      const entry = sortedData.find((w) => new Date(w.week).getTime() === ts);
      return entry ? entry.pace : null;
    });
  }, [weekTimestamps, sortedData]);

  // X-axis labels
  const labels = useMemo(() => {
    return weekTimestamps.map((ts) =>
      new Date(ts).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    );
  }, [weekTimestamps]);

  const data = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: "Avg Pace",
          data: paceSeconds,
          spanGaps: true,
          borderColor: "blue",
          backgroundColor: "rgba(0,0,255,0.1)",
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,

          // Style segments crossing gaps
          segment: {
            borderDash: (ctx) => {
              const { p0, p1 } = ctx;

              if (p0.raw === null || p1.raw === null) {
                return [6, 6];
              }

              return undefined;
            },
          },
        },
      ],
    };
  }, [labels, paceSeconds]);

  const options = useMemo(() => {
    return {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Weekly Pace Trend",
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const seconds = context.raw;
              return seconds ? `Pace: ${secondsToPace(seconds)}` : "No data";
            },
          },
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
            text: "Week",
          },
        },
      },
    };
  }, []);

  if (dataArray.length === 0) return null;

  return <Line data={data} options={options} />;
};

export default PaceTrendChart;
