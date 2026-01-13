import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Collections from "../pages/Collections";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collections" element={<Collections />} />
      {/* <Route path="/explore" element={<Explore />} />
      
      <Route path="/collection/:name" element={<CollectionDetail />} />
      <Route path="/create" element={<Create />} />
      <Route path="/nft/:id" element={<NFTDetail />} />
      <Route path="/profile/:address" element={<Profile />} /> */}
    </Routes>
  );
}
