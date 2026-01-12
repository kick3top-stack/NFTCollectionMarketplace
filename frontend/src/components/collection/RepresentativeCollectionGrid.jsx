import CollectionCard from "./CollectionCard";

const collections = [
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
  {
    name: "Lil Pudgys",
    owner: "@lilpudgys",
    items: 5000,
    image:
      "https://i2c.seadn.io/collection/uprising-genesis-emergence/image_type_hero_desktop/11639a43662e7461970427b7e8c358/3911639a43662e7461970427b7e8c358.jpeg?w=2000",
  },
  {
    name: "Lil Pudgys",
    owner: "@lilpudgys",
    items: 5000,
    image:
      "https://i2c.seadn.io/collection/uprising-genesis-emergence/image_type_hero_desktop/11639a43662e7461970427b7e8c358/3911639a43662e7461970427b7e8c358.jpeg?w=2000",
  },
  {
    name: "Lil Pudgys",
    owner: "@lilpudgys",
    items: 5000,
    image:
      "https://i2c.seadn.io/collection/uprising-genesis-emergence/image_type_hero_desktop/11639a43662e7461970427b7e8c358/3911639a43662e7461970427b7e8c358.jpeg?w=2000",
  },
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
  {
    name: "Lil Pudgys",
    owner: "@lilpudgys",
    items: 5000,
    image:
      "https://i2c.seadn.io/collection/uprising-genesis-emergence/image_type_hero_desktop/11639a43662e7461970427b7e8c358/3911639a43662e7461970427b7e8c358.jpeg?w=2000",
  },
  {
    name: "Lil Pudgys",
    owner: "@lilpudgys",
    items: 5000,
    image:
      "https://i2c.seadn.io/collection/uprising-genesis-emergence/image_type_hero_desktop/11639a43662e7461970427b7e8c358/3911639a43662e7461970427b7e8c358.jpeg?w=2000",
  },
  {
    name: "Lil Pudgys",
    owner: "@lilpudgys",
    items: 5000,
    image:
      "https://i2c.seadn.io/collection/uprising-genesis-emergence/image_type_hero_desktop/11639a43662e7461970427b7e8c358/3911639a43662e7461970427b7e8c358.jpeg?w=2000",
  },
  {
    name: "Uprising Genesis",
    owner: "@uprising",
    items: 3000,
    image:
      "https://i.seadn.io/gcs/files/11639a43662e7461970427b7e8c358.png?w=500&auto=format",
  },
];

export default function CollectionGrid() {
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
