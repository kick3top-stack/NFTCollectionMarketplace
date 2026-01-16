import { useState } from "react";
import CollectionGrid from "../components/collection/CollectionGrid";
import CollectionHeader from "../components/collection/CollectionHeader";
import FeaturedCollectionsSlider from "../components/collection/FeaturedCollectionsSlider";
import "../styles/CollectionsPage.css";

const allCollections = [
  {
    name: "CryptoPunks",
    owner: "@larvaLabs",
    items: 8240,
    image:
      "https://i2c.seadn.io/collection/lilpudgys/desktopHeroMedia/fec79b0c44a6a8b26a4c0cf4bb67ca/f8fec79b0c44a6a8b26a4c0cf4bb67ca.png?w=2000",
  },
  {
    name: "Bored Ape Yacht Club",
    owner: "@bayc",
    items: 10000,
    image:
      "https://i2c.seadn.io/collection/simulated-horizons-by-noper/image_type_hero_desktop/e14f82d5cd3b7d498f97ea67284484/76e14f82d5cd3b7d498f97ea67284484.gif?w=2000",
  },
  {
    name: "Lil Pudgys",
    owner: "@lilpudgys",
    items: 5000,
    image:
      "https://i2c.seadn.io/collection/uprising-genesis-emergence/image_type_hero_desktop/11639a43662e7461970427b7e8c358/3911639a43662e7461970427b7e8c358.jpeg?w=2000",
  },
];

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
      <FeaturedCollectionsSlider />
      <CollectionHeader title="All Collections" />
      <CollectionGrid collections={allCollections} />
    </section>
  );
}
