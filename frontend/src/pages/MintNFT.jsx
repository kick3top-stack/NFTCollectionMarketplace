import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SmartAlert from "../components/common/SmartAlert";
import { setMetaFiles as loadMetaFiles } from "../redux/metaSlice";
import "../styles/MintNFT.css";
import { nftContract } from "../utils/contractSetup";
import { getNFTContract } from "../utils/contracts";
import { uploadJSONToIPFS, uploadToIPFS } from "../utils/ipfs";

const MINT_PRICE = "0.01";

export default function MintNFT() {
  const [nftName, setNftName] = useState("");
  const [nftDesc, setNftDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [existingCollections, setExistingCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [alert, setAlert] = useState(null);

  const dispatch = useDispatch();

  // 🔹 Fetch existing collections from CONTRACT (source of truth)
  useEffect(() => {
    async function fetchCollections() {
      try {
        const total = Number(await nftContract.tokenCounter());
        const set = new Set();

        for (let tokenId = 0; tokenId < total; tokenId++) {
          const name = await nftContract.collections(tokenId);
          if (name) set.add(name);
        }

        const collections = [...set];
        setExistingCollections(collections);
        setSelectedCollection(collections[0] || "");
      } catch (err) {
        console.error("Failed to load collections:", err);
        setAlert({ message: "Failed to load collections", type: "error" });
      } finally {
        setLoadingCollections(false);
      }
    }

    fetchCollections();
  }, []);

  // 🔹 Mint NFT
  async function handleMint() {
    if (!nftName || !imageFile || !selectedCollection) {
      setAlert({
        message: "Please fill all fields and select a collection",
        type: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getNFTContract(signer);

      // Upload image
      const imageURI = await uploadToIPFS(imageFile);

      // Upload metadata
      const metadata = {
        name: nftName,
        description: nftDesc,
        image: imageURI,
        collectionName: selectedCollection, // IMPORTANT: matches contract
      };

      const tokenURI = await uploadJSONToIPFS(metadata);

      // Mint
      const tx = await contract.mintNFT(tokenURI, selectedCollection, {
        value: ethers.parseEther(MINT_PRICE),
      });

      await tx.wait();

      // 🔁 refresh Redux cache
      dispatch(loadMetaFiles());

      setAlert({ message: "NFT minted successfully!", type: "success" });
      setNftName("");
      setNftDesc("");
      setImageFile(null);
    } catch (err) {
      console.error("Mint failed:", err);
      setAlert({
        message: err?.reason || "Transaction failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loadingCollections) {
    return <div className="mint-page">Loading collections...</div>;
  }

  return (
    <div className="mint-page">
      <header className="mint-header">
        <h1>Mint a New NFT</h1>
        <p>Select a collection and mint your NFT.</p>
      </header>

      {/* Collection selection */}
      <div className="card">
        <h2>Select Collection</h2>
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          {existingCollections.map((col, idx) => (
            <option key={idx} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* NFT details */}
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

      <button
        className="button-primary"
        disabled={loading}
        onClick={handleMint}
      >
        {loading ? "Minting..." : "Mint NFT"}
      </button>

      <SmartAlert message={alert?.message} type={alert?.type} />
    </div>
  );
}
