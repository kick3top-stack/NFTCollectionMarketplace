import { nftContract, provider } from "./contractSetup";

/**
 * Fetch NFTs owned by connected wallet
 * Optionally filter by collection name
 */
export async function fetchNFTData(selectedCollection = null) {
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  // tokenCounter is PUBLIC
  const totalMinted = Number(await nftContract.tokenCounter());

  const ownedNFTs = [];

  for (let tokenId = 0; tokenId < totalMinted; tokenId++) {
    try {
      // 1. Ownership check
      const owner = await nftContract.ownerOf(tokenId);
      if (owner.toLowerCase() !== userAddress.toLowerCase()) continue;

      // 2. tokenURI (EXISTS via ERC721URIStorage)
      const tokenURI = await nftContract.tokenURI(tokenId);

      // 3. Fetch metadata JSON
      const metadataURL = fixIPFS(tokenURI);
      const response = await fetch(metadataURL);
      if (!response.ok) continue;

      const metadata = await response.json();

      // 4. Collection name (ON-CHAIN)
      const collectionName = await nftContract.collections(tokenId);

      // 5. Optional filtering by collection
      if (selectedCollection && collectionName !== selectedCollection) {
        continue;
      }

      ownedNFTs.push({
        tokenId,
        tokenURI: metadataURL,
        name: metadata.name || `NFT #${tokenId}`,
        description: metadata.description || "",
        image: metadata.image,
        collectionName,
        metadata,
      });
    } catch (err) {
      // tokenId may not exist or reverted
      console.warn(`Skipping tokenId ${tokenId}`, err);
    }
  }

  return ownedNFTs;
}

/**
 * Convert ipfs:// → https://ipfs.io/ipfs/
 */
function fixIPFS(url) {
  if (!url) return "";
  return url.startsWith("ipfs://")
    ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
    : url;
}
