const { expect } = require ("chai");
const hre = require("hardhat");

describe("GoodDay", function () {
    it("should have a name", async function () {
        const GD = await hre.ethers.deployContract("GoodDay", ["Ishan"]);
        
        expect (await GD.wishMe()).to.equal("Good Day Ishan");
        expect (await GD.wishMe()).to.be.revertedWith("No");
    });

    it("should change name to 'Varun'", async function () {

        const GD = await hre.ethers.deployContract("GoodDay", ["Ishan"]);
        await GD.changeName("Varun");
        expect (await GD.wishMe()).to.equal("Good Day Varun");
    });
});

//Run the tester using this:
//npx hardhat test test/GoodDay_test.js
//Running the 'npx hardhat test' runs all the files in the test directory.