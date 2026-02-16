import "./card.css";
const InjuryRiskCard = ({ risk }) => {
  const colors = {
    LOW: "green",
    MODERATE: "orange",
    HIGH: "red",
    NO_DATA: "gray",
  };

  return (
    <div className="card">
      <h3>Injury Risk</h3>
      <h2 style={{ color: colors[risk.risk] }}>{risk.risk}</h2>
      <p>ACWR: {risk.acwr}</p>
    </div>
  );
};

export default InjuryRiskCard;
