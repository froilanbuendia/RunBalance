import "./card.css";
import { FaCircleArrowUp, FaCircleArrowDown } from "react-icons/fa6";

const MileageCard = ({ miles, diff, duration, runs, completed, target }) => {
  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h${m.toString().padStart(2, "0")}m`;
  };

  const progress = Math.min((completed / target) * 100, 100);

  return (
    <div className="card">
      <h3>This Rolling Week</h3>
      <hr></hr>
      <h2 className="data-text">{miles.toFixed(2)} miles</h2>
      <hr></hr>
      <div className="goal-container">
        <p>Goal:</p>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <span>
            {completed.toFixed(1)} / {target} miles
          </span>
        </div>
      </div>
      <div className="mileage-info">
        <p>
          Runs: <b>{runs}</b>
        </p>
        <p>
          Duration: <b>{formatDuration(duration)}</b>
        </p>
        <p className="compare-rolling">
          {diff > 0 ? (
            <FaCircleArrowUp className="arrow-icon-up" />
          ) : (
            <FaCircleArrowDown className="arrow-icon-down" />
          )}
          <b>{diff.toFixed(2)} miles</b> vs. last week
        </p>
      </div>
    </div>
  );
};

export default MileageCard;
