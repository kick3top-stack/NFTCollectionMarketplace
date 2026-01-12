import NFTCard from "../components/NFTCard";
import "./Marketplace.css";

export default function Marketplace() {
  return (
    <div className="marketplace">
      <NFTCard
        image="https://via.placeholder.com/300"
        name="Sample NFT #1"
        price="1"
        onBuy={() => alert("Buy clicked")}
      />

      <NFTCard
        image="https://via.placeholder.com/300"
        name="Sample NFT #2"
        price="0.5"
        onBuy={() => alert("Buy clicked")}
      />
    </div>
  );
}