const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const NFTCollectionModule = buildModule("NFTCollection", (m) => {
  const nftcollection = m.contract("NFTCollection");

  return { nftcollection };
});

module.exports = NFTCollectionModule;
