import { useEffect, useState } from "react";
import MyNFTCard from "../components/nft/MyNFTCard";
import "../styles/MyNFTPage.css";
import {
  marketplaceContract,
  NFT_COLLECTION_ADDRESS,
} from "../utils/contractSetup";
import { fetchNFTData } from "../utils/fetchNFTData";

export default function MyNFTPage() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyNFTs();
  }, []);

  async function loadMyNFTs() {
    try {
      setLoading(true);

      // Fetch owned NFTs from NFTCollection contract
      const ownedNFTs = await fetchNFTData();

      // Attach listing info from the Marketplace contract
      const enrichedNFTs = await Promise.all(
        ownedNFTs.map(async (nft) => {
          const listing = await marketplaceContract.getListing(
            NFT_COLLECTION_ADDRESS,
            nft.tokenId
          );

          const isListed = listing.price > 0n;

          return {
            ...nft,
            listing: {
              isListed,
              price: isListed ? listing.price : null,
              seller: listing.seller,
            },
          };
        })
      );

      setNfts(enrichedNFTs);
    } catch (err) {
      console.error("Failed to load NFTs:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="my-nft-page">
        <p className="my-nft-page__loading">Loading your NFTs...</p>
      </div>
    );
  }

  return (
    <div className="my-nft-page">
      <h1 className="my-nft-page__title">My NFTs</h1>

      {nfts.length === 0 ? (
        <p className="my-nft-page__empty">You don’t own any NFTs yet.</p>
      ) : (
        <div className="my-nft-page__grid">
          {nfts.map((nft) => (
            <MyNFTCard
              key={nft.tokenId}
              nft={nft}
              onActionComplete={loadMyNFTs}
            />
          ))}
        </div>
      )}
    </div>
  );
}
