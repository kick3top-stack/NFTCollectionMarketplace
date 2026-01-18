import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "../../styles/FeaturedCollections.css";
import CollectionCard from "./CollectionCard";

export default function FeaturedCollectionsSlider({ collections }) {
  const topCollections = [...collections]
    .sort((a, b) => b.items - a.items) // Sort by number of items
    .slice(0, 5); // Get top 5 collections

  if (topCollections.length === 0) {
    return <p>No collections to display</p>; // Handling empty case
  }

  return (
    <div className="featured-slider-container">
      <Swiper
        modules={[Navigation]}
        loop={true} // no loop needed
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
        {topCollections.map((col, idx) => (
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
