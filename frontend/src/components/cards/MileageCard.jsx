import "./card.css";
const MileageCard = ({ miles }) => {
  return (
    <div className="card">
      <h3>This Week</h3>
      <h1>{miles.toFixed(1)} mi</h1>
    </div>
  );
};

export default MileageCard;
