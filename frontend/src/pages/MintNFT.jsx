import { ethers } from "ethers";
import { useEffect, useState } from "react";
import SmartAlert from "../components/common/SmartAlert";
import { getNFTContract } from "../utils/contracts";
import { uploadJSONToIPFS, uploadToIPFS } from "../utils/ipfs";

const MINT_PRICE = "0.01";

export default function MintNFT() {
  const [nftName, setNftName] = useState("");
  const [nftDesc, setNftDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [existingCollections, setExistingCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const contract = getNFTContract();
      const totalCollections = await contract.totalSupply();
      const collections = [];

      for (let i = 0; i < totalCollections; i++) {
        const collection = await contract.getCollection(i);
        collections.push(collection);
      }

      setExistingCollections(collections);
    };

    fetchCollections();
  }, []);

  const handleMint = async (selectedCollection) => {
    if (!nftName || !imageFile || !selectedCollection) {
      setAlert({
        message: "Please fill all fields and select a collection",
        type: "error",
      });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nftContract = getNFTContract(signer);

      // Upload image and metadata
      const imageURI = await uploadToIPFS(imageFile);
      const metadata = {
        name: nftName,
        description: nftDesc,
        image: imageURI,
        collection: selectedCollection,
      };
      const tokenURI = await uploadJSONToIPFS(metadata);

      // Mint the NFT to the selected collection
      const tx = await nftContract.mintNFT(tokenURI, selectedCollection, {
        value: ethers.parseEther(MINT_PRICE),
      });

      await tx.wait();
      setAlert({ message: "NFT minted successfully!", type: "success" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      console.error("Error minting NFT", err);
      setAlert({ message: err.reason || "Transaction failed", type: "error" });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mint-page">
      <header className="mint-header">
        <h1>Mint a New NFT</h1>
        <p>Select a collection and mint your NFT.</p>
      </header>

      <div className="card">
        <h2>Select Collection</h2>
        <select>
          {existingCollections.map((collection, index) => (
            <option key={index} value={collection.name}>
              {collection.name}
            </option>
          ))}
        </select>
      </div>

      {/* NFT Details */}
      <div className="card">
        <h2>NFT Details</h2>
        <input
          className="input"
          placeholder="NFT name"
          value={nftName}
          onChange={(e) => setNftName(e.target.value)}
        />
        <textarea
          className="input textarea"
          placeholder="NFT description"
          value={nftDesc}
          onChange={(e) => setNftDesc(e.target.value)}
        />
        <label className="dropzone">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {imageFile ? imageFile.name : "Upload NFT Image"}
        </label>
      </div>

      {/* Mint Summary */}
      <button
        className="button-primary"
        disabled={loading}
        onClick={() => handleMint(selectedCollection)}
      >
        {loading ? "Minting..." : "Mint NFT"}
      </button>

      {/* Alert */}
      <SmartAlert message={alert?.message} type={alert?.type} />
    </div>
  );
}
