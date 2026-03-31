import "./card.css";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m.toString().padStart(2, "0")}m`;
};

const formatPace = (seconds) => {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const MileageCard = ({ miles, diff, duration, runs, completed, target, paceAvg, streak }) => {
  const progress = target > 0 ? Math.min((completed / target) * 100, 100) : 0;
  const isAhead = diff >= 0;

  return (
    <div className="card metric-card">
      <div className="metric-card-header">
        <span className="metric-card-label">This Rolling Week</span>
        <span className={`metric-card-trend ${isAhead ? "trend-up" : "trend-down"}`}>
          {isAhead ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
          {Math.abs(diff).toFixed(1)} mi vs last week
        </span>
      </div>

      <div className="metric-card-hero">{miles.toFixed(1)}<span className="metric-card-unit">mi</span></div>

      <div className="metric-card-goal">
        <div className="metric-goal-labels">
          <span>{completed.toFixed(1)} mi completed</span>
          <span>Goal: {target} mi</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <span>{progress.toFixed(0)}%</span>
        </div>
      </div>

      <div className="metric-card-stats">
        <div className="metric-stat">
          <span className="metric-stat-value">{runs}</span>
          <span className="metric-stat-label">Runs</span>
        </div>
        <div className="metric-stat-divider" />
        <div className="metric-stat">
          <span className="metric-stat-value">{formatDuration(duration)}</span>
          <span className="metric-stat-label">Moving time</span>
        </div>
        <div className="metric-stat-divider" />
        <div className="metric-stat">
          <span className="metric-stat-value">{formatPace(paceAvg?.paceAvg)}</span>
          <span className="metric-stat-label">Avg pace</span>
        </div>
        <div className="metric-stat-divider" />
        <div className="metric-stat">
          <span className="metric-stat-value">{streak ?? 0}</span>
          <span className="metric-stat-label">Day streak</span>
        </div>
      </div>
    </div>
  );
};

export default MileageCard;