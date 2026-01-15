import { ethers } from "ethers";

// Your existing contract addresses and contract ABI
import NFTCollectionJSON from "../abi/NFTCollection.json";
import NFTMarketplaceJSON from "../abi/NFTMarketplace.json";

// Contract addresses (fill in your actual contract addresses)
export const NFT_COLLECTION_ADDRESS =
  "0xe2137EA89E844Db61377DABA16398d3999b29E45";
export const MARKETPLACE_ADDRESS = "0x8d39dd3F1D31313955271a67C56060ECC1a04d17";

// MetaMask provider
export const provider = new ethers.BrowserProvider(window.ethereum);

// Get signer from the connected wallet
export const getSigner = async () => {
  const signer = await provider.getSigner();
  return signer;
};

// Read-only contract instances
export const nftContract = new ethers.Contract(
  NFT_COLLECTION_ADDRESS,
  NFTCollectionJSON.abi,
  provider
);

export const marketplaceContract = new ethers.Contract(
  MARKETPLACE_ADDRESS,
  NFTMarketplaceJSON.abi,
  provider
);

/**
 * Fetch NFTs owned by connected wallet
 * Optionally filter by collection name
 */
