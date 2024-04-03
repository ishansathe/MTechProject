import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"


async function deployAndStoreFunds() {
    const vuln = await ethers.deployContract("Vulnerable")
    await vuln.waitForDeployment()

    const [acc1,acc2 , , , , , , acc8] = await ethers.getSigners()

    await acc8.sendTransaction({ to: vuln.target, value: ethers.parseEther("1")})

    return {vuln, acc1}
}
describe("Fund distributor contract", function() {
    it("Should be deployed", async function() {
        const {vuln, acc1} = await loadFixture(deployAndStoreFunds)

        await vuln.sentOnce(acc1)

        expect(await vuln.sentOnce(acc1)).to.equal(false)
    }) 
    it("Should have some funds allocated to it", async function() {
        const {vuln} = await loadFixture(deployAndStoreFunds)
        
        expect(await ethers.provider.getBalance(vuln.target)).to.equal(1000000000000000000n)
    })

    it("The withdraw function once called by an address, should not be recallable", async function() {
        const {vuln, acc1} = await loadFixture(deployAndStoreFunds)

        await vuln.connect(acc1).doCall(acc1)

        await expect(vuln.connect(acc1).doCall(acc1)).to.be.revertedWith(
            "100 wei have already been sent once!"
            )
        //When you are trying to check a revertedWith statement, remove the await when you are calling that specific function
    })
})