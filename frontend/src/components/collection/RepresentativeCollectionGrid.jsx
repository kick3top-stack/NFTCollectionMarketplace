import { useEffect, useState } from "react";
import { nftContract } from "../../utils/contractSetup";
import CollectionCard from "./CollectionCard";

export default function CollectionGrid() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const total = Number(await nftContract.tokenCounter());
        const collectionMap = {};

        // Fetch collection names and group them
        for (let tokenId = 0; tokenId < total; tokenId++) {
          const name = await nftContract.collections(tokenId);
          if (!name) continue;

          if (!collectionMap[name]) {
            collectionMap[name] = {
              name,
              owner: null,
              items: 0,
              image: null,
            };
          }

          collectionMap[name].items += 1;
        }

        // Fetch metadata for each collection
        for (const collectionName in collectionMap) {
          for (let tokenId = 0; tokenId < total; tokenId++) {
            const name = await nftContract.collections(tokenId);
            if (name !== collectionName) continue;

            const tokenURI = await nftContract.tokenURI(tokenId);
            const metadata = await fetch(tokenURI).then((r) => r.json());

            const owner = await nftContract.ownerOf(tokenId);

            collectionMap[collectionName].image = metadata.image;
            collectionMap[collectionName].owner = owner.slice(0, 6) + "...";

            break; // Get data from the first token of the collection
          }
        }

        const allCollections = Object.values(collectionMap);
        setCollections(allCollections);
        setLoading(false); // Data fetched, update loading state
      } catch (error) {
        console.error("Error fetching collections:", error);
        setLoading(false); // Even if an error happens, stop loading
      }
    };

    fetchCollections();
  }, []); // Runs once when the component is mounted

  if (loading) {
    return <div className="mint-page">Loading collections...</div>;
  }

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
