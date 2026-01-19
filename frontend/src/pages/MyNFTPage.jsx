import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MyNFTCard from "../components/nft/MyNFTCard";
import "../styles/MyNFTPage.css";
import {
  marketplaceContract,
  NFT_COLLECTION_ADDRESS,
} from "../utils/contractSetup";

export default function MyNFTPage() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get all NFT metadata from Redux
  const metaFiles = useSelector((state) => state.meta.metaFiles);

  // Use the connected wallet address (from MetaMask or other sources)
  const [userAddress, setUserAddress] = useState("");

  // Detect wallet address on page load
  // Detect wallet address on page load
  useEffect(() => {
    const getWalletAddress = async () => {
      try {
        if (!window.ethereum) throw new Error("No Ethereum wallet detected");

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length === 0) throw new Error("No wallet connected");

        setUserAddress(accounts[0]);
      } catch (err) {
        console.error("No wallet connected", err);
        setUserAddress(""); // fallback
      }
    };

    getWalletAddress();
  }, []);

  // Trigger NFT loading when both `metaFiles` and `userAddress` are ready
  useEffect(() => {
    if (!metaFiles.length || !userAddress) return; // Wait for both
    loadMyNFTs();
    console.log("MyNFTPage------->", metaFiles);
  }, [metaFiles, userAddress]); // Trigger when either changes

  async function loadMyNFTs() {
    try {
      setLoading(true);

      // Filter NFTs owned by the user
      const ownedNFTs = metaFiles.filter(
        (nft) => nft.owner.toLowerCase() === userAddress.toLowerCase()
      );

      if (ownedNFTs.length === 0) {
        setLoading(false);
        return;
      }

      // Attach listing info from Marketplace contract
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
