import { useState } from "react";
import { useSelector } from "react-redux"; // Use Redux state to access metaFiles
import CollectionGrid from "../components/collection/CollectionGrid";
import CollectionHeader from "../components/collection/CollectionHeader";
import FeaturedCollectionsSlider from "../components/collection/FeaturedCollectionsSlider";
import "../styles/CollectionsPage.css";

export default function Collections() {
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    sort: "Newest",
  });

  // Access metaFiles directly from Redux
  const metaFiles = useSelector((state) => state.meta.metaFiles);

  // If metadata is not loaded yet, we can show a loading message
  if (metaFiles.length === 0) {
    return <div className="mint-page">Loading collections...</div>;
  }

  // Group collections based on metaFiles (no need to fetch from contract again)
  const collectionMap = {};

  metaFiles.forEach((meta) => {
    const { collectionName, image, owner } = meta;

    // Initialize collection if not yet created
    if (!collectionMap[collectionName]) {
      collectionMap[collectionName] = {
        name: collectionName,
        owner: owner, // owner is already available in metadata
        items: 1,
        image: image, // image is already available in metadata
      };
    } else {
      collectionMap[collectionName].items += 1;
    }
  });

  // Convert collectionMap to an array
  const allCollections = Object.values(collectionMap);

  return (
    <section className="collections-page">
      <CollectionHeader title="Featured Collections" />
      <FeaturedCollectionsSlider collections={allCollections} />
      <CollectionHeader title="All Collections" />
      <CollectionGrid collections={allCollections} />
    </section>
  );
}
