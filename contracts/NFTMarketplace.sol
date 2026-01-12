// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

contract NFTMarketplace {
    struct Listing {
        uint256 price;
        address seller;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    bool private locked;

    // Events
    event ItemListed(address indexed tokenAddress, uint256 indexed tokenId, address indexed seller, uint256 price);
    event ItemBought(address indexed tokenAddress, uint256 indexed tokenId, address indexed buyer, uint256 price);
    event ItemCanceled(address indexed tokenAddress, uint256 indexed tokenId, address indexed seller);

    modifier noReentrant() {
        require(!locked, "Reentrancy detected");
        locked = true;
        _;
        locked = false;
    }

    // -------------------------------
    // List NFT for sale
    // -------------------------------
    function listItem(address tokenAddress, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be > 0");

        IERC721 token = IERC721(tokenAddress);
        require(token.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(
            token.getApproved(tokenId) == address(this) || token.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );

        listings[tokenAddress][tokenId] = Listing(price, msg.sender);

        emit ItemListed(tokenAddress, tokenId, msg.sender, price);
        console.log("%s's token-%s was completely listed into %s ETH.",msg.sender, tokenId, price / 1000000000000000000);
    }

    // -------------------------------
    // Buy NFT
    // -------------------------------
    function buyItem(address tokenAddress, uint256 tokenId) external payable noReentrant {
        Listing memory item = listings[tokenAddress][tokenId];
        require(item.price > 0, "NFT not for sale");
        require(msg.value == item.price, "Send exact ETH");

        delete listings[tokenAddress][tokenId];

        IERC721(tokenAddress).safeTransferFrom(item.seller, msg.sender, tokenId);

        (bool success, ) = payable(item.seller).call{value: msg.value}("");
        require(success, "Payment failed");

        emit ItemBought(tokenAddress, tokenId, msg.sender, item.price);
        console.log("%s bought %s for %s ETH.",msg.sender, tokenId, item.price / 1000000000000000000);
    }

    // -------------------------------
    // Cancel listing
    // -------------------------------
    function cancelListing(address tokenAddress, uint256 tokenId) external {
        Listing memory item = listings[tokenAddress][tokenId];
        require(item.seller == msg.sender, "Not seller");

        delete listings[tokenAddress][tokenId];

        emit ItemCanceled(tokenAddress, tokenId, msg.sender);
        console.log("%s list canceled %s", msg.sender, tokenId);
    }

    // -------------------------------
    // View listing
    // -------------------------------
    function getListing(address tokenAddress, uint256 tokenId) external view returns (Listing memory) {
        return listings[tokenAddress][tokenId];
    }
}