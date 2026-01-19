/////src/utils/loadMeta.js//////

import { setMetaFiles } from "../redux/metaSlice";

export const loadMetaFiles = async (dispatch, nftContract) => {
  try {
    const total = Number(await nftContract.tokenCounter());
    const metaFiles = [];

    for (let tokenId = 0; tokenId < total; tokenId++) {
      try {
        const tokenURI = await nftContract.tokenURI(tokenId);
        const metadata = await fetch(tokenURI).then((res) => res.json());
        const collectionName = await nftContract.collections(tokenId);
        const owner = await nftContract.ownerOf(tokenId);

        metaFiles.push({
          tokenId,
          collectionName,
          owner, // keep full address here
          displayOwner: owner.slice(0, 6) + "...",
          ...metadata,
        });
      } catch (err) {
        console.error(`Failed to load token ${tokenId}:`, err);
      }
    }

    dispatch(setMetaFiles(metaFiles));
    console.log("Meta files stored in Redux:", metaFiles);
  } catch (err) {
    console.error("Error loading metadata:", err);
  }
};
