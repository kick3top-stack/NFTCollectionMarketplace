//// src/components/collection/RepresentativeCollectionGrid.jsx

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/RepresentativeCollection.css";
import CollectionCard from "./CollectionCard";

export default function CollectionGrid() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const metaFiles = useSelector((state) => state.meta.metaFiles);

  useEffect(() => {
    if (metaFiles.length === 0) return;

    const collectionMap = {};

    metaFiles.forEach((meta) => {
      const { collectionName, image, owner } = meta;

      if (!collectionMap[collectionName]) {
        collectionMap[collectionName] = {
          name: collectionName,
          owner: owner.slice(0, 6) + "...",
          items: 1,
          image,
        };
      } else {
        collectionMap[collectionName].items += 1;
      }
    });

    // Simulated dynamic preload (smooth UX)
    const timeout = setTimeout(() => {
      setCollections(Object.values(collectionMap));
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [metaFiles]);

  if (loading) {
    return (
      <div className="rcg-loading">
        <div className="rcg-spinner" />
        <span>Loading collections…</span>
      </div>
    );
  }

  return (
    <section className="rcg-wrapper">
      <div className="rcg-grid">
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
    </section>
  );
}
