import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import NFTCard from "../components/nft/NFTCard";
import { marketplaceContract, nftContract } from "../utils/contractSetup";

export default function CollectionNFTPage() {
  const { collectionName: encodedName } = useParams();
  const collectionName = decodeURIComponent(encodedName);

  console.log("Collection Name from URL:", collectionName); // Debug log

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collectionName) return;

    const loadNFTs = async () => {
      try {
        setLoading(true);

        const total = Number(await nftContract.tokenCounter());
        const items = [];

        for (let tokenId = 0; tokenId < total; tokenId++) {
          const name = await nftContract.collections(tokenId);
          if (name !== collectionName) continue;

          const listing = await marketplaceContract.listings(
            nftContract.target,
            tokenId
          );
          if (listing.price === 0n) continue;

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
