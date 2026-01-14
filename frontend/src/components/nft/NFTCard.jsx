import { ethers } from "ethers";
import { useState } from "react";
import {
  getSigner,
  marketplaceContract,
  provider,
} from "../../utils/contractSetup";
import SmartAlert from "../common/SmartAlert";

export default function NFTCard({ nft }) {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    try {
      setLoading(true);

      const signer = await getSigner();
      const buyer = await signer.getAddress();

      const balance = await provider.getBalance(buyer);

      if (balance < nft.price) {
        setAlert("❌ Not enough ETH to buy this NFT");
        setTimeout(() => setAlert(null), 3000);
        setLoading(false);
        return;
      }

      const tx = await marketplaceContract
        .connect(signer)
        .buyItem(nft.tokenAddress, nft.tokenId, {
          value: nft.price,
        });

      await tx.wait();
    } catch (err) {
      console.error(err);
      setAlert("❌ Transaction failed");
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="nft-card">
        <img src={nft.image} alt={nft.name} />
        <h3>{nft.name}</h3>
        <p>{ethers.formatEther(nft.price)} ETH</p>

        <button onClick={handleBuy} disabled={loading}>
          {loading ? "Processing..." : "Buy"}
        </button>
      </div>

      <SmartAlert message={alert} />
    </>
  );
}
