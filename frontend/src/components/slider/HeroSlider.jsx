import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import "../../styles/slider.css";

const slides = [
    {
        title: "Discover Rare Digital Art",
        subtitle: "Explore exclusive NFTs from top creators worldwide",
        image: "https://i2c.seadn.io/collection/lilpudgys/desktopHeroMedia/fec79b0c44a6a8b26a4c0cf4bb67ca/f8fec79b0c44a6a8b26a4c0cf4bb67ca.png?w=2000",
        primaryBtn: "Explore",
        secondaryBtn: "Create",
    },
    {
        title: "Trade NFTs Securely",
        subtitle: "Buy, sell, and auction NFTs with full transparency",
        image: "https://i2c.seadn.io/collection/simulated-horizons-by-noper/image_type_hero_desktop/e14f82d5cd3b7d498f97ea67284484/76e14f82d5cd3b7d498f97ea67284484.gif?w=2000",
        primaryBtn: "Marketplace",
        secondaryBtn: "Learn More",
    },
    {
        title: "Own the Future of Art",
        subtitle: "The next generation of digital ownership starts here",
        image: "https://i2c.seadn.io/collection/uprising-genesis-emergence/image_type_hero_desktop/11639a43662e7461970427b7e8c358/3911639a43662e7461970427b7e8c358.jpeg?w=2000",
        primaryBtn: "Get Started",
        secondaryBtn: "View Collections",
    },
];

export default function HeroSlider() {
    return (
        <section className="hero-slider">
            <Swiper
                modules={[Autoplay, Navigation]}
                loop={true}
                navigation
                speed={1200} // 🔥 smooth transition
                autoplay={{
                    delay: 5500,
                    disableOnInteraction: false,
                }}
                preloadImages={false}
                lazy={true}
                className="hero-swiper"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="slide"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="dark-overlay" />
                            <div className="glow" />

                            <div className="content">
                                <h1 className="animate">{slide.title}</h1>
                                <p className="animate delay">
                                    {slide.subtitle}
                                </p>

                                <div className="buttons animate delay-2">
                                    <button className="btn primary">
                                        {slide.primaryBtn}
                                    </button>
                                    <button className="btn secondary">
                                        {slide.secondaryBtn}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}