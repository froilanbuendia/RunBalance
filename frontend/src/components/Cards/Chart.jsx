import "./card.css";
const Chart = ({ name, chart, handleRange, range }) => {
  return (
    <div className="card">
      <div>
        <div className="chart-title">
          <h3>{name}</h3>
          <div className="range-btn-container">
            <button
              className={range === "1m" ? "active-btn range-btn" : "range-btn"}
              onClick={() => handleRange("1m")}
            >
              1m
            </button>
            <button
              className={range === "3m" ? "active-btn range-btn" : "range-btn"}
              onClick={() => handleRange("3m")}
            >
              3m
            </button>
            <button
              className={range === "6m" ? "active-btn range-btn" : "range-btn"}
              onClick={() => handleRange("6m")}
            >
              6m
            </button>
            <button
              className={range === "1y" ? "active-btn range-btn" : "range-btn"}
              onClick={() => handleRange("1y")}
            >
              1y
            </button>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="chart">{chart}</div>
    </div>
  );
};

export default Chart;
