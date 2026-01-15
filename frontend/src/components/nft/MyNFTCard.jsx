import { useState } from "react";
import "../../styles/MyNFTCard.css";
import { marketplaceContract } from "../../utils/contractSetup";

export default function MyNFTCard({ nft, onActionComplete }) {
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [listingPrice, setListingPrice] = useState("");
  const [isListingLoading, setIsListingLoading] = useState(false);

  const {
    tokenId,
    tokenURI,
    name,
    description,
    image,
    collectionName,
    listing,
  } = nft;

  async function listNFT() {
    if (!listingPrice || isNaN(listingPrice) || Number(listingPrice) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      setIsListingLoading(true);

      // Interact with the marketplace contract to list the NFT
      await marketplaceContract.listItem(
        tokenURI,
        tokenId,
        Number(listingPrice) * 1e18
      ); // Convert to Wei

      // Close modal and reload NFTs after listing
      setIsListingModalOpen(false);
      onActionComplete();
    } catch (err) {
      console.error("Error listing NFT:", err);
      alert("An error occurred while listing the NFT.");
    } finally {
      setIsListingLoading(false);
    }
  }

  return (
    <div className="mynft-card">
      <div className="mynft-card__image-wrapper">
        <img className="mynft-card__image" src={image} alt={name} />
      </div>
      <h3 className="mynft-card__title">{name}</h3>
      <p className="mynft-card__collection">{collectionName}</p>
      <p className="mynft-card__description">{description}</p>

      <div className="mynft-card__listing-info">
        {listing.isListed ? (
          <p className="mynft-card__price">{`Listed for: ${
            listing.price / 1e18
          } ETH`}</p>
        ) : (
          <p className="mynft-card__not-listed">Not Listed</p>
        )}
      </div>

      {!listing.isListed && (
        <button
          className="list-nft-button"
          onClick={() => setIsListingModalOpen(true)}
        >
          List NFT
        </button>
      )}

      {isListingModalOpen && (
        <div className="list-nft-modal">
          <div className="modal-content">
            <h3>List NFT</h3>
            <input
              type="number"
              placeholder="Enter price in ETH"
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
            />
            <button onClick={listNFT} disabled={isListingLoading}>
              {isListingLoading ? "Listing..." : "List NFT"}
            </button>
            <button onClick={() => setIsListingModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
