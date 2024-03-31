import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { expect } from "chai"


async function deployTxOrigin() {

    const TXO = await ethers.deployContract("txOrigin")
    await TXO.waitForDeployment

    const [acc1, acc2] = await ethers.getSigners()

    await acc1.sendTransaction({ to: TXO, value: ethers.parseEther('20') })

    return { TXO, acc1, acc2 }
}
describe("TxOrigin Contract", function(){
    
    it("The address that deployed the contract should be the owner of it.", async function() {
        const { TXO, acc1 } = await loadFixture(deployTxOrigin)

        expect(await TXO.owner()).to.equal(acc1.address)
    })

    it("Should have certain funds allocated to it", async function(){
        const {TXO} = await loadFixture(deployTxOrigin)

        expect(await ethers.provider.getBalance(TXO.target)).to.not.equal(0)
    })

    it("Should not allow anyone other than owner of contract to call the function", async function () {
        const {TXO, acc2 } = await loadFixture(deployTxOrigin)

        //@ts-ignore
        await expect(TXO.connect(acc2).sendTo(acc2, 100)).to.be.revertedWith("You are not the owner!")
    })
})