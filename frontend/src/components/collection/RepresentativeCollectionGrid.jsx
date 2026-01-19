import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CollectionCard from "./CollectionCard";

export default function CollectionGrid() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const metaFiles = useSelector((state) => state.meta.metaFiles);
  console.log(metaFiles);

  useEffect(() => {
    if (metaFiles.length === 0) return;

    const collectionMap = {};

    // Group metaFiles by collectionName
    metaFiles.forEach((meta) => {
      const { collectionName, image, owner } = meta;

      if (!collectionMap[collectionName]) {
        collectionMap[collectionName] = {
          name: collectionName,
          owner: owner, // Already stored in Redux
          items: 1,
          image: image,
        };
      } else {
        collectionMap[collectionName].items += 1;
      }
    });

    setCollections(Object.values(collectionMap));
    setLoading(false);
  }, [metaFiles]);

  if (loading) return <div className="mint-page">Loading collections...</div>;

  return (
    <div className="collection-grid">
      {collections.map((col, idx) => (
        <CollectionCard
          key={idx}
          name={col.name}
          owner={col.owner}
          items={col.items}
          image={col.image}
        />
      ))}
    </div>
  );
}
