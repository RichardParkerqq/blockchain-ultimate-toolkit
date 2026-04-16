// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract NFTMarketplace {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public listingCount;

    event NFTListed(uint256 indexed listingId, address seller, address nft, uint256 tokenId, uint256 price);
    event NFTSold(uint256 indexed listingId, address buyer);

    function listNFT(address nftContract, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be positive");
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not owner");

        listings[listingCount] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            active: true
        });

        emit NFTListed(listingCount, msg.sender, nftContract, tokenId, price);
        listingCount++;
    }

    function buyNFT(uint256 listingId) external payable {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing inactive");
        require(msg.value >= listing.price, "Insufficient payment");

        listing.active = false;
        IERC721(listing.nftContract).transferFrom(listing.seller, msg.sender, listing.tokenId);
        payable(listing.seller).transfer(msg.value);

        emit NFTSold(listingId, msg.sender);
    }
}
