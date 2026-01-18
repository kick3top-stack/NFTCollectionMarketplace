import { useState } from "react";
import CollectionGrid from "../components/collection/CollectionGrid";
import CollectionHeader from "../components/collection/CollectionHeader";
import FeaturedCollectionsSlider from "../components/collection/FeaturedCollectionsSlider";
import "../styles/CollectionsPage.css";
import { nftContract } from "../utils/contractSetup";

const total = Number(await nftContract.tokenCounter());

const collectionMap = {};

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

for (const collectionName in collectionMap) {
  for (let tokenId = 0; tokenId < total; tokenId++) {
    const name = await nftContract.collections(tokenId);
    if (name !== collectionName) continue;

    const tokenURI = await nftContract.tokenURI(tokenId);
    const metadata = await fetch(tokenURI).then((r) => r.json());

    const owner = await nftContract.ownerOf(tokenId);

    collectionMap[collectionName].image = metadata.image;
    collectionMap[collectionName].owner = owner.slice(0, 6) + "...";

    break;
  }
}

const allCollections = Object.values(collectionMap);

export default function Collections() {
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    sort: "Newest",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // TODO: Fetch filtered collections via API / Web3 contract
  };

  return (
    <section className="collections-page">
      <CollectionHeader title="Featured Collections" />
      <FeaturedCollectionsSlider collections={allCollections} />
      <CollectionHeader title="All Collections" />
      <CollectionGrid collections={allCollections} />
    </section>
  );
}
