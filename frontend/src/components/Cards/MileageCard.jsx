import "./card.css";
const MileageCard = ({ miles }) => {
  return (
    <div className="card">
      <h3>This Rolling Week</h3>
      <hr></hr>
      <h2 className="data-text">{miles.toFixed(2)} miles</h2>
      <hr></hr>
    </div>
  );
};

export default MileageCard;
