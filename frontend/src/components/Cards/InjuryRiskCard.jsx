import "./card.css";

const RISK_CONFIG = {
  LOW:      { color: "var(--success)", label: "Low Risk",  subtitle: "Training load is well managed" },
  MODERATE: { color: "var(--warning)", label: "Moderate",  subtitle: "Monitor your fatigue this week" },
  HIGH:     { color: "var(--danger)",  label: "High Risk", subtitle: "Consider reducing your load" },
  NO_DATA:  { color: "var(--text-muted)", label: "No Data", subtitle: "Sync activities to calculate risk" },
};

const ACWR_ZONE = (acwr) => {
  if (!acwr || acwr === 0) return "No recent data";
  if (acwr < 0.8)  return "Training load is low — room to build";
  if (acwr <= 1.3) return "You're in the optimal training zone";
  if (acwr <= 1.5) return "Approaching the danger zone";
  return "High injury risk — consider rest";
};

const InjuryRiskCard = ({ risk }) => {
  const config = RISK_CONFIG[risk.risk] ?? RISK_CONFIG.NO_DATA;

  return (
    <div className="card metric-card">
      <div className="metric-card-header">
        <span className="metric-card-label">Injury Risk</span>
      </div>

      <div className="metric-card-hero" style={{ color: config.color }}>
        {config.label}
      </div>

      <p className="metric-card-subtitle">{ACWR_ZONE(risk.acwr)}</p>

      <div className="metric-card-stats">
        <div className="metric-stat">
          <span className="metric-stat-value">{risk.acwr ?? "—"}</span>
          <span className="metric-stat-label">ACWR</span>
        </div>
        <div className="metric-stat-divider" />
        <div className="metric-stat">
          <span className="metric-stat-value">{risk.acuteMiles?.toFixed(1) ?? "—"}</span>
          <span className="metric-stat-label">Acute (7d)</span>
        </div>
        <div className="metric-stat-divider" />
        <div className="metric-stat">
          <span className="metric-stat-value">{risk.chronicMiles?.toFixed(1) ?? "—"}</span>
          <span className="metric-stat-label">Chronic (28d)</span>
        </div>
      </div>
    </div>
  );
};

export default InjuryRiskCard;