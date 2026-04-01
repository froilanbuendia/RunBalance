import { useRef, useState } from "react";
import "./card.css";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { updateGoal } from "../../api/athlete";

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

const MileageCard = ({ miles, diff, duration, runs, completed, target, paceAvg, streak, chronicMiles, onGoalUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  const suggestedLow = chronicMiles ? Math.floor(chronicMiles * 0.8) : null;
  const suggestedHigh = chronicMiles ? Math.ceil(chronicMiles * 1.3) : null;
  const outsideRange = suggestedLow !== null && target > 0 &&
    (target < suggestedLow || target > suggestedHigh);

  const progress = target > 0 ? Math.min((completed / target) * 100, 100) : 0;
  const isAhead = diff >= 0;

  const startEdit = () => {
    setInputVal(target || "");
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitEdit = async () => {
    const val = Number(inputVal);
    if (!val || val <= 0 || val === target) { setEditing(false); return; }
    setSaving(true);
    try {
      await updateGoal(val);
      onGoalUpdate?.();
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditing(false);
  };

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
          {editing ? (
            <span className="goal-edit-wrap">
              <input
                ref={inputRef}
                className="goal-input"
                type="number"
                min="1"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={commitEdit}
                disabled={saving}
              />
              <span className="goal-input-unit">mi</span>
            </span>
          ) : (
            <button className={`goal-label-btn ${outsideRange ? "goal-label-warning" : ""}`} onClick={startEdit}>
              {target > 0 ? `Goal: ${target} mi` : "Set goal"}{outsideRange ? " ⚠" : ""}
            </button>
          )}
        </div>
        {suggestedLow !== null && (
          <p className="goal-suggested">
            Suggested safe range: {suggestedLow}–{suggestedHigh} mi
            {outsideRange && " — your goal is outside this range"}
          </p>
        )}
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