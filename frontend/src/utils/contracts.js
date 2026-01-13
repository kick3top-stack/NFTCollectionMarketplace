import { ethers } from "ethers";
import NFTCollectionArtifact from "../abi/NFTCollection.json";


// 🔴 REPLACE with your deployed NFTCollection address
export const NFT_COLLECTION_ADDRESS =
  "0xf664F1418ddaab35AF3d6104ee33894a2903d2a7";

export function getNFTContract(signerOrProvider) {
  return new ethers.Contract(
    NFT_COLLECTION_ADDRESS,
    NFTCollectionArtifact.abi, // ✅ THIS IS THE FIX
    signerOrProvider
  );
}
