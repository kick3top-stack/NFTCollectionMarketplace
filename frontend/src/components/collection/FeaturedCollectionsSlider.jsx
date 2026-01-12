import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import CollectionCard from "./CollectionCard";
import "../../styles/FeaturedCollections.css";

const featuredCollections = [
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
    name: "Uprising Genesis",
    owner: "@uprising",
    items: 3000,
    image:
      "https://image.mux.com/mkY6wsCxpYMp01D818oMjelqylXssC1flvTt1NxIjjgE/thumbnail.jpg?time=0",
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
      "https://image.mux.com/mkY6wsCxpYMp01D818oMjelqylXssC1flvTt1NxIjjgE/thumbnail.jpg?time=0",
  },
];

export default function FeaturedCollectionsSlider() {
  return (
    <div className="featured-slider-container">
      <Swiper
        modules={[Navigation]}
        loop={true}  // no loop needed
        slidesPerView={3}
        spaceBetween={20}
        loopFillGroupWithBlank={true}
        navigation
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1400: { slidesPerView: 4 },
        }}
      >
        {featuredCollections.map((col, idx) => (
          <SwiperSlide key={idx}>
            <CollectionCard
              name={col.name}
              owner={col.owner}
              items={col.items}
              image={col.image}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
