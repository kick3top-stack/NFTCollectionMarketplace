const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");  // 🔹 MUST add

describe("NFTMarketplace", function () {

  async function deployFixture() {
    const [owner, user1, user2] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("NFTCollection");
    const Marketplace = await ethers.getContractFactory("NFTMarketplace");

    const nft = await NFT.deploy();
    await nft.waitForDeployment();

    const market = await Marketplace.deploy();
    await market.waitForDeployment();

    return { nft, market, owner, user1, user2 };
  }

  describe("Listing, Buying, Canceling NFTs", function () {
    it("allows listing and buying NFT", async function () {
      const { nft, market, user1, user2 } = await loadFixture(deployFixture);

      await nft.connect(user1).mintNFT("ipfs://token1", "Collection1", { value: ethers.parseEther("0.01") });
      await nft.connect(user1).mintNFT("ipfs://token1", "Collection1", { value: ethers.parseEther("0.01") });
      await nft.connect(user1).mintNFT("ipfs://token1", "Collection2", { value: ethers.parseEther("0.01") });
      await nft.connect(user1).approve(market.getAddress(), 0);
      await nft.connect(user1).approve(market.getAddress(), 2);
      await market.connect(user1).listItem(nft.getAddress(), 0, ethers.parseEther("1"));
      await market.connect(user1).listItem(nft.getAddress(), 2, ethers.parseEther("2"));
      await market.connect(user2).buyItem(nft.getAddress(), 0, { value: ethers.parseEther("1") });

      expect(await nft.ownerOf(0)).to.equal(user2.address);
    });

    it("prevents listing by non-owner", async function () {
      const { nft, market, user1, user2 } = await loadFixture(deployFixture);

      await nft.connect(user1).mintNFT("ipfs://token1", "Collection1", { value: ethers.parseEther("0.01") });

      await expect(
        market.connect(user2).listItem(nft.getAddress(), 0, ethers.parseEther("1"))
      ).to.be.revertedWith("Not the owner");
    });

    it("allows canceling listing by seller", async function () {
      const { nft, market, user1 } = await loadFixture(deployFixture);

      await nft.connect(user1).mintNFT("ipfs://token1", "Collection1", { value: ethers.parseEther("0.01") });
      await nft.connect(user1).approve(market.getAddress(), 0);
      await market.connect(user1).listItem(nft.getAddress(), 0, ethers.parseEther("1"));

      await market.connect(user1).cancelListing(nft.getAddress(), 0);

      const listing = await market.getListing(nft.getAddress(), 0);
      expect(listing.price).to.equal(0);
    });

    it("prevents canceling by non-seller", async function () {
      const { nft, market, user1, user2 } = await loadFixture(deployFixture);

      await nft.connect(user1).mintNFT("ipfs://token1", "Collection1", { value: ethers.parseEther("0.01") });
      await nft.connect(user1).approve(market.getAddress(), 0);
      await market.connect(user1).listItem(nft.getAddress(), 0, ethers.parseEther("1"));

      await expect(
        market.connect(user2).cancelListing(nft.getAddress(), 0)
      ).to.be.revertedWith("Not seller");
    });
  });
});