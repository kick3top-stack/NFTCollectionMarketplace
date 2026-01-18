import HeroSlider from "../components/slider/HeroSlider";
import RepresentativeCollection from "../components/collection/RepresentativeCollection";

export default function Home() {
  return (
    <div className="home-page">
      <HeroSlider />
      <RepresentativeCollection />
      {/* Optionally: Featured NFTs section */}
    </div>
  );
}
