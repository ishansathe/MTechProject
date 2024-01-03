import {ethers} from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Delegator Contracts", function() {
    async function deployContracts() {
        const library = await ethers.getContractFactory("delegateLibrary")
        const delLibrary = await library.deploy()

        const delegator = await ethers.deployContract("VulnDelegator", [delLibrary.target])
        await delegator.waitForDeployment()

        const [acc1, acc2] = await ethers.getSigners()

        return {delLibrary, delegator, acc1, acc2}
    }

    describe("Library Contract", function() {
        it("should have a number variable initially set to 0", async function() {
            const {delLibrary} = await loadFixture(deployContracts)

            //@ts-ignore   //Runs fine, but throws error. Smth to do with getContractFactory function
            expect(await delLibrary.number()).to.equal(0)
        })
        it("should have a function to change numbers and change successfully", async function() {
            const {delLibrary} = await loadFixture(deployContracts)
            //@ts-ignore
            await delLibrary.changeNum(77)

            //@ts-ignore
            expect(await delLibrary.number()).to.equal(77)
        })
    })  

    describe("Vulnerable Delegator", function() {
        it("should have owner set to the person that called deployed the contract", async function() {
            const { delegator, acc1} = await loadFixture(deployContracts)

            expect(await delegator.owner()).to.equal(acc1.address)
        })
        it("should not allow other people call the proclaimOwnership function!", async function() {
            const {delegator, acc2} = await loadFixture(deployContracts)

            expect(delegator.connect(acc2).proclaimOwnership()).to.be.revertedWith("You are not the owner!")
        })
    })
    
})