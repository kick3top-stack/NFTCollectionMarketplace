import CollectionHeader from "./CollectionHeader";
import CollectionGrid from "./RepresentativeCollectionGrid";
import "../../styles/RepresentativeCollection.css";

export default function RepresentativeCollection() {
  return (
    <section className="collection-section">
      <div className="collection-container">
        <CollectionHeader />
        <CollectionGrid />
      </div>
    </section>
  );
}
