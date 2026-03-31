import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { getChartColors } from "../../utils/chartTheme";

const secondsToPace = (seconds) => {
  if (!seconds || seconds <= 0) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const PaceTrendChart = ({ paceData }) => {
  const colors = useMemo(() => getChartColors(), []);

  const dataArray = useMemo(() => paceData || [], [paceData]);

  const sortedData = useMemo(
    () => [...dataArray].sort((a, b) => new Date(a.week) - new Date(b.week)),
    [dataArray],
  );

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

  const paceSeconds = useMemo(
    () =>
      weekTimestamps.map((ts) => {
        const entry = sortedData.find(
          (w) => new Date(w.week).getTime() === ts,
        );
        return entry ? entry.pace : null;
      }),
    [weekTimestamps, sortedData],
  );

  const labels = useMemo(
    () =>
      weekTimestamps.map((ts) =>
        new Date(ts).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      ),
    [weekTimestamps],
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Avg Pace",
          data: paceSeconds,
          spanGaps: true,
          borderColor: colors.info,
          backgroundColor: colors.infoFill,
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: colors.info,
          borderWidth: 2,
          segment: {
            borderDash: (ctx) => {
              const { p0, p1 } = ctx;
              if (p0.raw === null || p1.raw === null) return [6, 6];
              return undefined;
            },
          },
        },
      ],
    }),
    [labels, paceSeconds, colors],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              ctx.raw ? `${secondsToPace(ctx.raw)} /mi` : "No data",
          },
        },
      },
      scales: {
        y: {
          reverse: true,
          ticks: {
            color: colors.textMuted,
            callback: (value) => secondsToPace(value),
          },
          grid: { color: colors.borderMuted },
          title: {
            display: true,
            text: "Pace /mi",
            color: colors.textMuted,
          },
        },
        x: {
          ticks: { color: colors.textMuted },
          grid: { display: false },
        },
      },
    }),
    [colors],
  );

  if (dataArray.length === 0)
    return (
      <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
        No data for this period
      </p>
    );

  return <Line data={data} options={options} />;
};

export default PaceTrendChart;