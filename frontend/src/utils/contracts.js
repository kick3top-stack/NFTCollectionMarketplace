import { ethers } from "ethers";
import NFTCollectionArtifact from "../abi/NFTCollection.json";

// 🔴 REPLACE with your deployed NFTCollection address
export const NFT_COLLECTION_ADDRESS =
  "0x8d39dd3F1D31313955271a67C56060ECC1a04d17";

export function getNFTContract(signerOrProvider) {
  return new ethers.Contract(
    NFT_COLLECTION_ADDRESS,
    NFTCollectionArtifact.abi, // ✅ THIS IS THE FIX
    signerOrProvider
  );
}
