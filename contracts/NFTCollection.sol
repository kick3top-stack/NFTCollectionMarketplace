// SPDX-License-Identifier: MIT
////////NFTCollection.sol/////////////////////

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract NFTCollection is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    uint256 public constant MINT_PRICE = 0.01 ether;

    // tokenId => collection label
    mapping(uint256 => string) public collections;

    // Events
    event Minted(address indexed user, uint256 tokenId, string collectionName);
    event FreeTransfer(address indexed from, address indexed to, uint256 tokenId);

    constructor() ERC721("MyNFTCollection", "MNFT") Ownable(msg.sender) {
        tokenCounter = 0;
        console.log("log-----Deployed");
    }

    // -------------------------------
    // Public minting
    // -------------------------------
    function mintNFT(string memory tokenURI, string memory collectionName) external payable returns (uint256) {
        require(msg.value == MINT_PRICE, "Incorrect ETH sent");
        require(bytes(collectionName).length > 0, "Collection name required");

        uint256 tokenId = tokenCounter;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        collections[tokenId] = collectionName;

        tokenCounter++;

        emit Minted(msg.sender, tokenId, collectionName);
        console.log("log----%s's %s minted into %s", msg.sender, tokenId, collectionName);

        return tokenId;
    }

    // -------------------------------
    // Free transfer by owner
    // -------------------------------
    function freeTransfer(uint256 tokenId, address to) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(to != address(0), "Invalid recipient");

        _transfer(msg.sender, to, tokenId);

        emit FreeTransfer(msg.sender, to, tokenId);
        console.log("%s transfered %s into %s", msg.sender, tokenId, to);
    }

    // -------------------------------
    // Withdraw ETH (owner only)
    // -------------------------------
    function withdraw(address payable to) external onlyOwner {
        require(to != address(0), "Invalid address");
        console.log("%s ETH returned into owner.", address(this).balance / 1000000000000000000);
        to.transfer(address(this).balance);
    }
}