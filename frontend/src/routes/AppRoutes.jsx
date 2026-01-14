import { Route, Routes } from "react-router-dom";
import CollectionNFTPage from "../pages/CollectionNFTPage";
import Collections from "../pages/Collections";
import CreateCollection from "../pages/CreateCollection";
import Home from "../pages/Home";

import {
  marketplaceContract,
  nftContract,
  signer,
} from "../utils/contractSetup";

export default function AppRoutes() {
  return (
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
            signer={signer} // Pass the signer to enable transactions
          />
        }
      />

      {/* <Route path="/explore" element={<Explore />} />
      
      <Route path="/collection/:name" element={<CollectionDetail />} />
      <Route path="/create" element={<Create />} />
      <Route path="/nft/:id" element={<NFTDetail />} />
      <Route path="/profile/:address" element={<Profile />} /> */}
    </Routes>
  );
}
