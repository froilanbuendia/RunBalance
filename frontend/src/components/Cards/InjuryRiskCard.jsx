import "./card.css";
const InjuryRiskCard = ({ risk }) => {
  const colors = {
    LOW: "var(--success)",
    MODERATE: "var(--warning)",
    HIGH: "var(--danger)",
    NO_DATA: "gray",
  };
  console.log(risk);

  return (
    <div className="card">
      <h3>Injury Risk</h3>
      <hr></hr>
      <h2 style={{ color: colors[risk.risk] }} className="data-text">
        {risk.risk}
      </h2>
      <hr></hr>
      <p>
        ACWR: <b>{risk.acwr}</b>
      </p>
      <div className="acute-chronic-container">
        <p>
          Acute: <b>{risk.acuteMiles.toFixed(2)}</b>
        </p>
        <p>
          Chronic: <b>{risk.chronicMiles.toFixed(2)}</b>
        </p>
      </div>
    </div>
  );
};

export default InjuryRiskCard;
