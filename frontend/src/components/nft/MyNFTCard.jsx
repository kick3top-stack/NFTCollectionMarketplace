import { ethers } from "ethers";
import { useState } from "react";
import marketPlacceAbi from "../../abi/NFTMarketplace.json";
import "../../styles/MyNFTCard.css";
import {
  MARKETPLACE_ADDRESS,
  nftContract,
  provider,
} from "../../utils/contractSetup";
import SmartAlert from "../common/SmartAlert";

export default function MyNFTCard({ nft, onActionComplete }) {
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [listingPrice, setListingPrice] = useState("");
  const [isListingLoading, setIsListingLoading] = useState(false);
  const [alert, setAlert] = useState({});

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
      setAlert({
        message: "Please enter a valid price.",
        type: "warning",
      });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    const owner = await nftContract.ownerOf(tokenId);
    const signer = await provider.getSigner();
    console.log(owner);

    const marketplaceContract = new ethers.Contract(
      MARKETPLACE_ADDRESS,
      marketPlacceAbi.abi,
      signer
    );

    try {
      setIsListingLoading(true);

      const signer = await provider.getSigner();
      await (
        await nftContract
          .connect(signer)
          .approve(marketplaceContract.target, tokenId)
      ).wait();
      console.log(marketplaceContract.target);

      //   Interact with the marketplace contract to list the NFT
      const priceInWei = ethers.parseEther(listingPrice.toString());
      await (
        await marketplaceContract.listItem(
          nftContract.target,
          tokenId,
          priceInWei
        )
      ).wait(); // Convert to Wei
      //   await txList; // Wait for the listing transaction to be mined

      // Close modal and reload NFTs after listing
      setIsListingModalOpen(false);
      onActionComplete();
    } catch (err) {
      console.error("Error listing NFT:", err);
      setAlert({
        message: "An error occurred while listing the NFT.",
        type: "error",
      });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setIsListingLoading(false);
    }
  }

  async function cancelListing() {
    try {
      setIsListingLoading(true);

      const signer = await provider.getSigner();
      const marketplaceContract = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        marketPlacceAbi.abi,
        signer
      );

      const tx = await marketplaceContract.cancelListing(
        nftContract.target,
        tokenId
      );

      await tx.wait();

      setAlert({
        message: "Listing canceled successfully.",
        type: "success",
      });

      onActionComplete(); // refresh NFTs
    } catch (err) {
      console.error("Error canceling listing:", err);
      setAlert({
        message: err.reason || "Failed to cancel listing.",
        type: "error",
      });
    } finally {
      setIsListingLoading(false);
      setTimeout(() => setAlert(null), 3000);
    }
  }

  return (
    <>
      <div className="mynft-card">
        <div className="mynft-card__image-wrapper">
          <img className="mynft-card__image" src={image} alt={name} />
        </div>
        <h3 className="mynft-card__title">{name}</h3>
        <p className="mynft-card__collection">{collectionName}</p>
        <p className="mynft-card__description">{description}</p>

        <div className="mynft-card__listing-info">
          {listing.isListed ? (
            <p className="mynft-card__price">{`Listed for: ${ethers.formatEther(
              listing.price
            )} ETH`}</p>
          ) : (
            <p className="mynft-card__not-listed">Not Listed</p>
          )}
        </div>

        {listing.isListed ? (
          <button
            className="cancel-listing-button"
            onClick={cancelListing}
            disabled={isListingLoading}
          >
            {isListingLoading ? "Canceling..." : "Cancel Listing"}
          </button>
        ) : (
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
              <button onClick={() => setIsListingModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <SmartAlert message={alert?.message} type={alert?.type} />
    </>
  );
}
