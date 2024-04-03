import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { expect } from "chai"

describe ("Treasure Chest Smart Contract", function () {

    async function deployTreasureChest() {

        const [acc1, acc2] = await ethers.getSigners()
        const tc = await ethers.getContractFactory("TreasureChest")
        const TC = await tc.connect(acc1).deploy()

        return {TC, acc1, acc2}
    }
    it("Treasure chest should be having some funds by default", async function() {
        const { TC } = await loadFixture(deployTreasureChest)

        expect(await TC.treasureChest()).to.equal(500)
    })

    it("should not allow creators to take the chest for themselves", async function() {
        const {TC} = await loadFixture(deployTreasureChest)

        expect(TC.claimTreasure()).to.be.revertedWith(
            "It is unfair to let creators take the chest themselves"
        )
    })

    it("Once treasure chest is closed, calling closeTreasure again should fail", async function() {
        const {TC, acc1} = await loadFixture(deployTreasureChest)

        await TC.connect(acc1).closeChest()

        expect (TC.closeChest()).to.be.revertedWithCustomError(TC, 'ChestAlreadyClosed')
    })

    it("Once treasure is claimed, should revert with a failure message when trying to claim again", async function() {
        const {TC, acc2} = await loadFixture(deployTreasureChest)

        await TC.connect(acc2).claimTreasure()
        expect (TC.connect(acc2).claimTreasure()).to.be.revertedWith("Treasure chest is either claimed or closed!")
    })

    it("Once treasure is closed, should revert with a failure message when trying to claim", async function() {
        const {TC, acc1, acc2} = await loadFixture(deployTreasureChest)

        await TC.connect(acc1).closeChest()
        expect (TC.connect(acc2).claimTreasure()).to.be.revertedWith("Treasure chest is either claimed or closed!")
    })

})
