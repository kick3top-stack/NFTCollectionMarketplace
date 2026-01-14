import { ethers } from "ethers";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/CollectionNFTPage.css"; // Make sure to import CSS

export default function CollectionNFTPage({
  nftContract,
  marketplaceContract,
}) {
  const { collectionName } = useParams();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListedNFTs() {
      setLoading(true);

      try {
        const totalTokens = await nftContract.tokenCounter();
        const listedNFTs = [];

        for (let tokenId = 0; tokenId < totalTokens; tokenId++) {
          const name = await nftContract.collections(tokenId);
          if (name === collectionName) {
            const listing = await marketplaceContract.listings(
              nftContract.address,
              tokenId
            );
            if (Number(listing.price) > 0) {
              const tokenURI = await nftContract.tokenURI(tokenId);
              const meta = await fetch(tokenURI).then((res) => res.json());

              listedNFTs.push({
                tokenId,
                ...meta,
                price: listing.price,
              });
            }
          }
        }

        setNfts(listedNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }

      setLoading(false);
    }

    loadListedNFTs();
  }, [collectionName, nftContract, marketplaceContract]);

  return (
    <div className="nft-page">
      <h1 className="page-title">{collectionName}</h1>

      {loading ? (
        <p className="loading">Loading NFTs...</p>
      ) : nfts.length === 0 ? (
        <p className="loading">No NFTs listed in this collection yet.</p>
      ) : (
        <div className="nft-grid">
          {nfts.map((nft, index) => (
            <motion.div
              key={nft.tokenId}
              className="nft-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.04 }}
            >
              <img src={nft.image} alt={nft.name} />
              <div className="nft-info">
                <h3>{nft.name}</h3>
                <p>#{nft.tokenId}</p>
                <p className="price">
                  Price: {ethers.formatEther(nft.price)} ETH
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
