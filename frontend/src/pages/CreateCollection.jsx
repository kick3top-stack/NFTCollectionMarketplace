import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../styles/create-collection.css";
import { uploadToIPFS, uploadJSONToIPFS } from "../utils/ipfs";
import { getNFTContract } from "../utils/contracts";

const MINT_PRICE = "0.01";

export default function CreateCollection() {
    console.log("CreateCollection function has been called.");
  const [collectionName, setCollectionName] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDesc, setNftDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        getNFTContract();
    }, [])

  async function handleCreate() {
    if (!window.ethereum) {
      alert("Wallet not connected");
      return;
    }

    if (!collectionName || !nftName || !imageFile) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const nftContract = getNFTContract(signer);

      // Upload image
      const imageURI = await uploadToIPFS(imageFile);

      // Create metadata
      const metadata = {
        name: nftName,
        description: nftDesc,
        image: imageURI,
        collection: collectionName,
        creator: userAddress
      };

      const tokenURI = await uploadJSONToIPFS(metadata);

      // Mint NFT
      const tx = await nftContract.mintNFT(
        tokenURI,
        collectionName,
        { value: ethers.parseEther(MINT_PRICE) }
      );

      await tx.wait();

      window.location.href = `/collections/${collectionName}`;
    } catch (err) {
      console.error(err);
      alert(err.reason || "Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-page">
      <header className="create-header">
        <h1>Create a collection</h1>
        <p>Create a new collection by minting your first NFT.</p>
      </header>

      <div className="card">
        <h2>Collection details</h2>

        <input
          className="input"
          placeholder="Collection name *"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />

        <textarea
          className="input textarea"
          placeholder="Description (optional)"
          value={collectionDesc}
          onChange={(e) => setCollectionDesc(e.target.value)}
        />
      </div>

      <div className="card">
        <h2>Your first NFT</h2>

        <label className="dropzone">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {imageFile ? imageFile.name : "Upload NFT image *"}
        </label>

        <input
          className="input"
          placeholder="NFT name *"
          value={nftName}
          onChange={(e) => setNftName(e.target.value)}
        />

        <textarea
          className="input textarea"
          placeholder="NFT description (optional)"
          value={nftDesc}
          onChange={(e) => setNftDesc(e.target.value)}
        />
      </div>

      <div className="mint-summary">
        <div className="summary-row">
          <span>Mint price</span>
          <strong>0.01 ETH</strong>
        </div>

        <button
          className="button-primary"
          disabled={loading}
          onClick={handleCreate}
        >
          {loading ? "Creating..." : "Create collection"}
        </button>
      </div>
    </div>
  );
}
