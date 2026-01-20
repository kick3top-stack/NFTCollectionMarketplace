import RepresentativeCollection from "../components/collection/RepresentativeCollection";
import SingleSlide from "../components/slider/HeroSlider";

export default function Home() {
  return (
    <div className="home-page">
      <SingleSlide />
      <RepresentativeCollection />
      {/* Optionally: Featured NFTs section */}
    </div>
  );
}
