import { formatEther } from "ethers";
import { marketplaceContract } from "./contractSetup";

export async function getNFTListing(tokenAddress, tokenId) {
  const listing = await marketplaceContract.getListing(tokenAddress, tokenId);

  return {
    isListed: listing.price > 0n,
    price: listing.price > 0n ? formatEther(listing.price) : null,
    seller: listing.seller,
  };
}
