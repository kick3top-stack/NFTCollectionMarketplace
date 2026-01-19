import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import CollectionNFTPage from "../pages/CollectionNFTPage";
import Collections from "../pages/Collections";
import CreateCollection from "../pages/CreateCollection";
import Home from "../pages/Home";
import MintNFT from "../pages/MintNFT";
import MyNFTPage from "../pages/MyNFTPage";
import Preloader from "../pages/Preloader";

import {
  getSigner,
  marketplaceContract,
  nftContract,
} from "../utils/contractSetup";

export default function AppRoutes() {
  const [loading, setLoading] = useState(true);

  // Simulate a page load for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 3 seconds (example)
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Preloader />} {/* Display preloader globally */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/create" element={<CreateCollection />} />
        <Route
          path="/collection/:collectionName"
          element={
            <CollectionNFTPage
              nftContract={nftContract}
              marketplaceContract={marketplaceContract}
              signer={getSigner()} // Pass the signer to enable transactions
            />
          }
        />
        <Route path="/mynfts" element={<MyNFTPage />} />
        <Route path="/mintNFT" element={<MintNFT />} />
        {/* <Route path="/explore" element={<Explore />} />
      
      <Route path="/collection/:name" element={<CollectionDetail />} />
      <Route path="/create" element={<Create />} />
      <Route path="/nft/:id" element={<NFTDetail />} />
      <Route path="/profile/:address" element={<Profile />} /> */}
      </Routes>
    </>
  );
}
