const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BoringWall", function () {
  it("Should return correct symbol", async function () {
    const Bwall = await ethers.getContractFactory("BoringWall");
    const bwall = await Bwall.deploy();
    await bwall.deployed();

    const name = await bwall.name();
    expect(name).equal('Boring Wall');

    const symbol = await bwall.symbol();
    expect(symbol).equal('BWALL');
  });

  describe('Buying a pixel', () => {
    it("Buys pixel" , async () => {
      const Bwall = await ethers.getContractFactory("BoringWall");
      const bwall = await Bwall.deploy();
      await bwall.deployed();
  
      await bwall.buyPixel(0, 12345,  {value : ethers.utils.parseEther("1.0")});
      const pixel = await bwall.getPixel(0);
      expect(pixel.color).equal(12345);
    });


    it("Stop buy pixel if pixel is purchased" , async () => {
      const Bwall = await ethers.getContractFactory("BoringWall");
      const bwall = await Bwall.deploy();
      await bwall.deployed();
  
      await bwall.buyPixel(0, 12345,  {value : ethers.utils.parseEther("1.0")});
      await bwall.buyPixel
      await expect( bwall.buyPixel(0, 12345,  {value : ethers.utils.parseEther("1.0")}))
        .to
        .be
        .revertedWith('This pixel is already purchased');
    });
  });

  describe("Changing a pixel color", () => {
    it("Should change a pixel color", async () => {
      const Bwall = await ethers.getContractFactory("BoringWall");
      const bwall = await Bwall.deploy();
      await bwall.deployed();
      await bwall.buyPixel(5, 55555, {value : ethers.utils.parseEther("1.0")});

      await bwall.changePixelColor(
        5, 22222, {value : ethers.utils.parseEther("1.0")}
      );

      const pixel = await bwall.getPixel(5);
      expect(pixel.color).equal(22222);
    });

    it("Should not change a pixel color of another owner", async () => {
      const Bwall = await ethers.getContractFactory("BoringWall");
      const bwall = await Bwall.deploy();
      await bwall.deployed();
      await bwall.buyPixel(5, 55555, {value : ethers.utils.parseEther("1.0")});

      const [owner, addr1] = await ethers.getSigners();
      await expect(bwall.connect(addr1).changePixelColor(5, 22222, {value : ethers.utils.parseEther("1.0")}))
        .to
        .be
        .revertedWith('You are not the owner of this pixel');
    });
  });

  describe("Get batch of pixels", () => {
    it("Should get batch of pixels", async () => {
      const Bwall = await ethers.getContractFactory("BoringWall");
      const bwall = await Bwall.deploy();
      await bwall.deployed();

      const batch1 = await bwall.getBatched(0, 2048);
      expect(batch1.length).equal(2048);
      const batch2 = await bwall.getBatched(2048, 2048);
      expect(batch2.length).equal(2048);
    });
  });
});
