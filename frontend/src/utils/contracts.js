import { ethers } from "ethers";
import NFTCollectionArtifact from "../abi/NFTCollection.json";

// 🔴 REPLACE with your deployed NFTCollection address
export const NFT_COLLECTION_ADDRESS =
  "0xe2137EA89E844Db61377DABA16398d3999b29E45";

export function getNFTContract(signerOrProvider) {
  return new ethers.Contract(
    NFT_COLLECTION_ADDRESS,
    NFTCollectionArtifact.abi, // ✅ THIS IS THE FIX
    signerOrProvider
  );
}
