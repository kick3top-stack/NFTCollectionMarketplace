import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import NFTCard from "../components/nft/NFTCard";
import { marketplaceContract, nftContract } from "../utils/contractSetup";

export default function CollectionNFTPage() {
  const { collectionName } = useParams();

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collectionName) return;

    const loadNFTs = async () => {
      try {
        setLoading(true);

        // total minted NFTs
        const total = await nftContract.tokenCounter();

        const items = [];

        for (let tokenId = 0; tokenId < Number(total); tokenId++) {
          // 1️⃣ check collection name
          const name = await nftContract.collections(tokenId);
          if (name !== collectionName) continue;

          // 2️⃣ check if listed (HIDDEN until listed)
          const listing = await marketplaceContract.listings(
            nftContract.target, // ethers v6 address
            tokenId
          );

          if (listing.price === 0n) continue;

          // 3️⃣ token metadata
          const tokenURI = await nftContract.tokenURI(tokenId);
          const metadata = await fetch(tokenURI).then((res) => res.json());

          items.push({
            tokenId,
            tokenAddress: nftContract.target,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            price: listing.price,
            seller: listing.seller,
          });
        }

        setNfts(items);
      } catch (err) {
        console.error("Failed to load NFTs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [collectionName]);

  return (
    <div className="collection-nft-page">
      <h1 className="collection-title">{collectionName}</h1>

      {loading ? (
        <p className="loading-text">Loading NFTs...</p>
      ) : nfts.length === 0 ? (
        <p className="empty-text">No listed NFTs in this collection</p>
      ) : (
        <div className="nft-grid">
          {nfts.map((nft) => (
            <NFTCard key={nft.tokenId} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
}
