//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import "hardhat/console.sol";

contract BoringWall is ERC721Enumerable, Ownable  {

    string public baseUrl = '';
    uint256 private _price = 0.06 ether;
    uint256 private _changeFee = 0.0006 ether;

    struct Pixel {
        uint256 tokenId;
        uint24 color;
        uint256 created;
    }

    mapping(uint256 => Pixel) pixels;

    constructor() ERC721("Boring Wall", "BWALL") {

    }

    function changeBaseUrl(string memory newUrl) public onlyOwner {
        baseUrl = newUrl;
    }

    // set price incase ether is crazy.
    function setPrice(uint256 _newPrice) public onlyOwner {
      _price = _newPrice;
    }

    // set price incase ether is crazy.
    function setChangeFee(uint256 _newPrice) public onlyOwner {
      _changeFee = _newPrice;
    }

    function _baseURI()internal view virtual override returns (string memory) {
        return baseUrl;
    }

    function buyPixel (uint256 tokenId, uint24 color) public payable {
        // TODO: Maybe check if tokenId is more than uint256
        require(msg.value >= _price, "Funds not correct");
        require(!_exists(tokenId), "This pixel is already purchased");
        
        _safeMint(msg.sender, tokenId);
        pixels[tokenId] = Pixel(tokenId, color, block.timestamp); 
    }

    function changePixelColor (uint256 tokenId, uint24 color) public payable {
        require(msg.value >= _changeFee, "Funds not correct");
        require(ownerOf(tokenId) == msg.sender, 'You are not the owner of this pixel');
        require(pixels[tokenId].color != color, 'The color is the same');
        pixels[tokenId].color = color;
    }

    function getPixel(uint256 tokenId) public view returns (Pixel memory){
        if (_exists(tokenId)) {
            return pixels[tokenId];
        }

        return Pixel(
            tokenId,
            16777215,
            0
        );
    }

    function getBatched(uint256 start, uint256 limit) view public returns (Pixel[] memory) {
        Pixel[] memory _pixels = new Pixel[](limit);

        uint256 end = start + limit;
        uint256 returnIndex = 0;
        for (uint256 i = start; i < end; i++) {
            _pixels[returnIndex] = getPixel(i);
            returnIndex++;
        }

        return _pixels;
    }

    // TODO :
    function withdraw() public payable onlyOwner {
        console.log('comming soon');
        // require(payable(myAccount).send(address(this).balance));
    }
}