import { useNavigate } from "react-router-dom";
import "../../styles/RepresentativeCollection.css";

export default function CollectionCard({ name, owner, items, image }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/collection/${encodeURIComponent(name)}`);
  };

  return (
    <div className="collection-card" onClick={handleClick}>
      <div
        className="collection-image"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="collection-info">
        <h3>{name}</h3>
        <p className="owner">{owner}</p>
        <p className="items">{items} Items</p>
      </div>
    </div>
  );
}
