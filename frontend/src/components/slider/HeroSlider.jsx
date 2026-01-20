import "../../styles/slider.css"; // Import the CSS file for custom styles

const SingleSlide = () => {
  return (
    <div className="single-slide-container">
      {/* Fire Layer */}
      <div className="fire-layer"></div>

      {/* Lightning Layer */}
      <div className="lightning-layer"></div>

      {/* Center Clash Overlay */}
      <div className="clash-overlay"></div>

      {/* Main Content */}
      <div className="slide-content">
        <h1 className="title">Clash of Legends</h1>
        <p className="description">
          Witness the epic battle between fire and lightning.
        </p>
        <button className="explore-button">Explore Marketplace</button>
      </div>
    </div>
  );
};

export default SingleSlide;
