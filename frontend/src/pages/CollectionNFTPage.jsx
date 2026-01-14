import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CollectionNFTPage({ nftContract }) {
  const { collectionName } = useParams();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNFTs() {
      setLoading(true);

      const total = await nftContract.tokenCounter();
      const results = [];

      for (let tokenId = 0; tokenId < total; tokenId++) {
        const name = await nftContract.collections(tokenId);
        if (name === collectionName) {
          const uri = await nftContract.tokenURI(tokenId);
          const meta = await fetch(uri).then((r) => r.json());

          results.push({
            tokenId,
            ...meta,
          });
        }
      }

      setNfts(results);
      setLoading(false);
    }

    loadNFTs();
  }, [collectionName]);

  return (
    <div className="nft-page">
      <h1 className="page-title">{collectionName}</h1>

      {loading ? (
        <p className="loading">Loading NFTs...</p>
      ) : (
        <div className="nft-grid">
          {nfts.map((nft, i) => (
            <motion.div
              key={nft.tokenId}
              className="nft-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.04 }}
            >
              <img src={nft.image} alt={nft.name} />
              <div className="nft-info">
                <h3>{nft.name}</h3>
                <p>#{nft.tokenId}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
