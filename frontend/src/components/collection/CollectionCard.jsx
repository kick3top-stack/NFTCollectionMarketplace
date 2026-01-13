import "../../styles/RepresentativeCollection.css";

export default function CollectionCard({ name, owner, items, image }) {
  return (
    <div className="collection-card">
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
