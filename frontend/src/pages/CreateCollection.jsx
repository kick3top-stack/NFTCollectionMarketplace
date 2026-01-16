import { ethers } from "ethers";
import { useEffect, useState } from "react";
import SmartAlert from "../components/common/SmartAlert";
import "../styles/create-collection.css";
import { getNFTContract } from "../utils/contracts";
import { nftContract } from "../utils/contractSetup";
import { uploadJSONToIPFS, uploadToIPFS } from "../utils/ipfs";

const MINT_PRICE = "0.01";

export default function CreateCollection() {
  const [collectionName, setCollectionName] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDesc, setNftDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [existingCollections, setExistingCollections] = useState(new Set());

  useEffect(() => {
    // Fetch existing collections to prevent duplicates
    const fetchCollections = async () => {
      try {
        const totalTokens = await nftContract.tokenCounter(); // get total minted
        const collectionsSet = new Set();

        for (let i = 0; i < totalTokens; i++) {
          const collection = await nftContract.collections(i);
          collectionsSet.add(collection);
        }

        setExistingCollections(collectionsSet);
      } catch (err) {
        console.error("Failed to fetch collections", err);
      }
    };

    fetchCollections();
  }, []);

  const handleCreate = async () => {
    if (!window.ethereum) {
      setAlert({ message: "Ethereum not detected", type: "error" });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (!collectionName || !nftName || !imageFile) {
      setAlert({ message: "Please fill all required fields", type: "error" });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (existingCollections.has(collectionName)) {
      setAlert({ message: "Collection already exists!", type: "warning" });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const nftContract = getNFTContract(signer);

      // Check balance for minting
      const balance = await provider.getBalance(userAddress);
      if (balance < ethers.parseEther(MINT_PRICE)) {
        setAlert({ message: "Not enough ETH to mint", type: "error" });
        setTimeout(() => setAlert(null), 3000);
        setLoading(false);
        return;
      }

      // Upload image to IPFS
      const imageURI = await uploadToIPFS(imageFile);

      // Create NFT metadata
      const metadata = {
        name: nftName,
        description: nftDesc,
        image: imageURI,
        collection: collectionName,
        creator: userAddress,
      };

      const tokenURI = await uploadJSONToIPFS(metadata);

      // Mint the first NFT along with the collection
      const tx = await nftContract.mintNFT(tokenURI, collectionName, {
        value: ethers.parseEther(MINT_PRICE),
      });

      await tx.wait();
      setAlert({ message: "NFT minted successfully!", type: "success" });
      setTimeout(() => setAlert(null), 3000);

      // Redirect to the collection page or clear form
      window.location.href = `/collections/${collectionName}`;
    } catch (err) {
      console.error("Error minting NFT", err);
      setAlert({ message: err.reason || "Transaction failed", type: "error" });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <header className="create-header">
        <h1>Create a Collection</h1>
        <p>Create a new collection by minting your first NFT.</p>
      </header>

      {/* Create Collection Form */}
      <div className="card">
        <h2>Collection Details</h2>
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

      {/* Mint NFT Form */}
      <div className="card">
        <h2>Your First NFT</h2>
        <label className="dropzone">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {imageFile ? imageFile.name : "Upload NFT Image *"}
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

      {/* Mint Summary */}
      <div className="mint-summary">
        <div className="summary-row">
          <span>Mint Price</span>
          <strong>0.01 ETH</strong>
        </div>
        <button
          className="button-primary"
          disabled={loading}
          onClick={handleCreate}
        >
          {loading ? "Creating..." : "Create Collection and Mint NFT"}
        </button>
      </div>

      {/* Alert */}
      <SmartAlert message={alert?.message} type={alert?.type} />
    </div>
  );
}
