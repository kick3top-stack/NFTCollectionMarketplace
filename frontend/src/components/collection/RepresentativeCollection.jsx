import "../../styles/RepresentativeCollection.css";
import CollectionHeader from "./CollectionHeader";
import CollectionGrid from "./RepresentativeCollectionGrid";

export default function RepresentativeCollection() {
  return (
    <section className="rc-section">
      <div className="rc-container">
        <CollectionHeader />
        <CollectionGrid />
      </div>
    </section>
  );
}
