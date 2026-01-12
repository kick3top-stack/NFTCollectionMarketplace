import "./NFTCard.css";

export default function NFTCard({ image, name, price, onBuy }) {
  return (
    <div className="nft-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>

      {price && <p>{price} ETH</p>}

      {onBuy && <button onClick={onBuy}>Buy</button>}
    </div>
  );
}