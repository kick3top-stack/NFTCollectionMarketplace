const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const NFTMarketplaceModule = buildModule("NFTMarketplace", (m) => {
  const nftmarketplace = m.contract("NFTMarketplace");

  return { nftmarketplace };
});

module.exports = NFTMarketplaceModule;
