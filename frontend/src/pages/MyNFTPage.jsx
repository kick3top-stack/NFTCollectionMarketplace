import { useEffect, useState } from "react";
import SmartAlert from "../components/common/SmartAlert"; // Optional if you want to show alerts
import "../styles/MyNFTPage.css";
import { getSigner, nftContract } from "../utils/contractSetup"; // Adjust import based on your contract setup

export default function NFTPage() {
  console.log("my naft page.");
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      try {
        const signer = await getSigner();
        const userAddress = await signer.getAddress();

        const totalTokens = await nftContract.tokenCounter(); // Get total minted tokens
        const nftArray = [];

        // Loop through all minted tokens to check ownership
        for (let i = 0; i < totalTokens; i++) {
          const tokenId = i;
          const owner = await nftContract.ownerOf(tokenId); // Get the owner of this token

          if (owner.toLowerCase() === userAddress.toLowerCase()) {
            // Only push the NFTs owned by the current user
            const collectionName = await nftContract.collections(tokenId);
            const tokenURI = await nftContract.tokenURI(tokenId); // Get token URI

            // Fetch metadata (like image, name, etc.)
            const response = await fetch(tokenURI);
            const metadata = await response.json();

            nftArray.push({
              tokenId,
              collectionName,
              image: metadata.image,
              name: metadata.name,
              description: metadata.description,
              tokenURI,
            });
          }
        }

        setNfts(nftArray);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setLoading(false);
        setAlert({ message: "❌ Failed to fetch NFTs", type: "error" });
        setTimeout(() => setAlert(null), 3000);
      }
    };

    fetchOwnedNFTs();
  }, []);

  return (
    <div className="nft-page">
      {alert && <SmartAlert message={alert.message} type={alert.type} />}

      {loading ? (
        <p>Loading your NFTs...</p>
      ) : (
        <div className="nft-grid">
          {/* Handle the case when no NFTs are found */}
          {nfts.length === 0 ? (
            <p>No NFTs found. Start minting some NFTs!</p>
          ) : (
            nfts.map((nft) => (
              <div key={nft.tokenId} className="nft-card">
                <img src={nft.image} alt={nft.name} />
                <h3>{nft.name}</h3>
                <p>{nft.collectionName}</p>
                <p>{nft.description}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
