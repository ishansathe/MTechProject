import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { expect } from "chai"


async function deployTxOrigin() {
    const txO = await ethers.getContractFactory("txOrigin")
    const TXO = await txO.deploy()
    const [acc1, acc2] = await ethers.getSigners()

    return { TXO, acc1, acc2 }
}
describe("TxOrigin Contract", function(){
    it("should be deployed correctly", async function() {
        const { TXO, acc1 } = await loadFixture(deployTxOrigin)

        expect(await TXO.owner()).to.equal(acc1)
    })

    it("Should not allow anyone other than owner of contract to call the function", async function () {
        const {TXO, acc2 } = await loadFixture(deployTxOrigin)

        await expect(TXO.connect(acc2).sendTo(acc2, 100)).to.be.revertedWith("You are not the owner!")
    })
})