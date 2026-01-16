import { ethers } from "ethers";
import { useEffect, useState } from "react";
import SmartAlert from "../components/common/SmartAlert";
import "../styles/create-collection.css";
import { getNFTContract } from "../utils/contracts";
import { nftContract } from "../utils/contractSetup";
import { uploadJSONToIPFS, uploadToIPFS } from "../utils/ipfs";

const MINT_PRICE = "0.01";

export default function CreateCollection() {
  console.log("CreateCollection function has been called.");
  const [collectionName, setCollectionName] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDesc, setNftDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [existingCollections, setExistingCollections] = useState(new Set());

  useEffect(() => {
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

  useEffect(() => {
    getNFTContract();
  }, []);

  async function handleCreate() {
    if (!window.ethereum) {
      setAlert({
        message: "Not enough ETH to mint this NFT",
        type: "error",
      });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (!collectionName || !nftName || !imageFile) {
      setAlert({
        message: "Please fill all required fields",
        type: "error",
      });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    try {
      setLoading(true);

      ///check enough money
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const nftContract = getNFTContract(signer);

      // Check if collection already exists
      if (existingCollections.has(collectionName)) {
        setAlert({
          message: "This collection already exists!",
          type: "warning",
        });
        setTimeout(() => setAlert(null), 3000);
        return;
      }

      const balance = await provider.getBalance(userAddress);
      if (balance < MINT_PRICE * 10000000000 * 100000000) {
        setAlert({
          message: "Not enough ETH to mint this NFT",
          type: "error",
        });
        setTimeout(() => setAlert(null), 3000);
        setLoading(false);
        return;
      }

      // Upload image
      const imageURI = await uploadToIPFS(imageFile);

      // Create metadata
      const metadata = {
        name: nftName,
        description: nftDesc,
        image: imageURI,
        collection: collectionName,
        creator: userAddress,
      };

      const tokenURI = await uploadJSONToIPFS(metadata);
      console.log(metadata);

      // Mint NFT
      const tx = await nftContract.mintNFT(tokenURI, collectionName, {
        value: ethers.parseEther(MINT_PRICE),
      });

      await tx.wait();

      setAlert("NFT minted successfully!");
      setTimeout(() => setAlert(null), 3000);

      window.location.href = `/collections/${collectionName}`;
    } catch (err) {
      console.error(err);
      setAlert(err.reason || "Transaction failed");
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
      <SmartAlert message={alert?.message} type={alert?.type} />
    </div>
  );
}
