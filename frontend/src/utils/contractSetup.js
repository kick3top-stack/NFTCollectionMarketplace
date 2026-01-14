import { ethers } from "ethers";
// Import ABI for NFTCollection and NFTMarketplace
import NFTCollectionABI from "../abi/NFTCollection.json";
import NFTMarketplaceABI from "../abi/NFTMarketplace.json";

// Set up your provider (MetaMask or a custom provider like Infura)
export const provider = new ethers.BrowserProvider(window.ethereum);

// Replace these with your actual contract addresses
const nftContractAddress = "0xe2137EA89E844Db61377DABA16398d3999b29E45";
const marketplaceContractAddress = "0x8d39dd3F1D31313955271a67C56060ECC1a04d17";

// Initialize contracts using their addresses and ABIs
const nftContract = new ethers.Contract(
  nftContractAddress,
  NFTCollectionABI.abi,
  provider
);
const marketplaceContract = new ethers.Contract(
  marketplaceContractAddress,
  NFTMarketplaceABI.abi,
  provider
);

// Get signer from the provider to send transactions (e.g., MetaMask)
const signer = provider.getSigner();

export { marketplaceContract, nftContract, signer };
