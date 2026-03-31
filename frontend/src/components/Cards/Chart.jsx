import "./card.css";
const Chart = ({ name, chart, handleRange, range, heatmap, handleHeatMap }) => {
  return (
    <div className="card">
      <div className="chart-title">
        <h3>{name}</h3>
        {range && (
          <div className="filter-btn-container">
            <button
              className={
                range === "1m" ? "active-btn filter-btn" : "filter-btn"
              }
              onClick={() => handleRange("1m")}
            >
              1m
            </button>
            <button
              className={
                range === "3m" ? "active-btn filter-btn" : "filter-btn"
              }
              onClick={() => handleRange("3m")}
            >
              3m
            </button>
            <button
              className={
                range === "6m" ? "active-btn filter-btn" : "filter-btn"
              }
              onClick={() => handleRange("6m")}
            >
              6m
            </button>
            <button
              className={
                range === "1y" ? "active-btn filter-btn" : "filter-btn"
              }
              onClick={() => handleRange("1y")}
            >
              1y
            </button>
          </div>
        )}
        {heatmap && (
          <div className="filter-btn-container">
            <button
              className={
                heatmap === "distance" ? "active-btn filter-btn" : "filter-btn"
              }
              onClick={() => handleHeatMap("distance")}
            >
              Distance
            </button>
            <button
              className={
                heatmap === "effort" ? "active-btn filter-btn" : "filter-btn"
              }
              onClick={() => handleHeatMap("effort")}
            >
              Effort
            </button>
            <button
              className={
                heatmap === "elevation" ? "active-btn filter-btn" : "filter-btn"
              }
              onClick={() => handleHeatMap("elevation")}
            >
              Elevation
            </button>
          </div>
        )}
      </div>
      <hr></hr>
      {heatmap ? (
        <div className="chart-heatmap-wrapper">
          <div className="chart-heatmap">{chart}</div>
        </div>
      ) : (
        <div className="chart">{chart}</div>
      )}
    </div>
  );
};

export default Chart;
