import "./card.css";
const MileageCard = ({ miles }) => {
  return (
    <div className="card">
      <h3>This Week</h3>
      <hr></hr>
      <h2 className="data-text">{miles.toFixed(2)} miles</h2>
    </div>
  );
};

export default MileageCard;
