import {ethers} from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Delegate Call to Pseudo-Random Number Generator Library", function() {
    async function deployContracts() {

        const delLibrary = await ethers.deployContract("delegateLibrary")
        await delLibrary.waitForDeployment()

        const delegator = await ethers.deployContract("VulnDelegator", [delLibrary.target])
        await delegator.waitForDeployment()

        const [acc1, acc2] = await ethers.getSigners()

        return {delLibrary, delegator, acc1, acc2}
    }

    describe("Pseudo Random Number Generator Library Contract", function() {
        it("should have a 'number' variable with some numeric value to refer to", async function() {
            const {delLibrary} = await loadFixture(deployContracts)

            var proofInt: BigInt = await delLibrary.number()
            expect(proofInt).to.be.a('BigInt')
        })

        it("The function of library contract should be capable of changing the value of 'number' variable", async function() {
            const {delLibrary} = await loadFixture(deployContracts)
            
            var initNum = await delLibrary.number()
            await delLibrary.changeNum(77)
            // Storing the initial number and then changing it

            expect(await delLibrary.number()).to.not.equal(initNum)
        })
    })  

    describe("Numeric Reference Contract", function() {

        it("Owner of the contract must be the person that deployed it.", async function() {
            const { delegator, acc1} = await loadFixture(deployContracts)
            expect(await delegator.owner()).to.equal(acc1.address)
        })

        it("should not allow other people call the proclaimOwnership function!", async function() {
            const {delegator, acc2} = await loadFixture(deployContracts)
            expect(delegator.connect(acc2).proclaimOwnership()).to.be.revertedWith("You are not the owner!")
        })

        it("should have a public getter function 'number' for reference to a numeric value", async function() {
            const {delegator} = await loadFixture(deployContracts)
            expect(await delegator.number()).to.be.a('BigInt')
        })
    })
    
})