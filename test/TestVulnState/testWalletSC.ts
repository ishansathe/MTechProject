import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";

async function deployWallets() {
    const [acc1, acc2, ,,,,,,,acc10] = await ethers.getSigners()
    // Collecting account addresses to be used later

    const WalletSC1 = await ethers.deployContract("FalseConsWallet");
    const WalletSC2 = await ethers.deployContract("NoSubWallet");
    const WalletSC3 = await ethers.deployContract("NewWrongSignWallet")
    // Attempting a deployment of smart contracts and storing their interfaces within
    // the constant variables

    await WalletSC1.waitForDeployment()
    await WalletSC2.waitForDeployment()
    await WalletSC3.waitForDeployment()
    // Ensuring the smart contracts are deployed.

    await WalletSC1.connect(acc10).deposit({value: ethers.parseEther('100')})
    await WalletSC2.connect(acc10).deposit({value: ethers.parseEther('300')})
    await WalletSC3.connect(acc10).deposit({value: ethers.parseEther('500')})
    // Depositing funds within the contract for use.

    return {acc1, acc2, acc10, WalletSC1, WalletSC2, WalletSC3}
}

describe("Wallet Smart Contract 1", function () {

    it("should not have any owner prior to function call", async function () {
        
        const {WalletSC1} = await loadFixture(deployWallets)

        expect( await WalletSC1.creator() ).to.equal('0x0000000000000000000000000000000000000000') 
        // Since address is seen as a string
    })

    it("Owner set after calling the initWallet function", async function() {
        const {WalletSC1, acc1} = await loadFixture(deployWallets)

        await WalletSC1.initWallet()
        // Hardhat always uses the first account as default account for operations

        expect(await WalletSC1.creator()).to.equal(acc1.address)
    })
})

describe("Wallet Smart Contract 2", function ()  {
    it("should have some funds by default ", async function() {
        const {WalletSC2} = await loadFixture(deployWallets)

        expect(await ethers.provider.getBalance(WalletSC2)).to.not.equal(0)
        // The statement for checking
    })

    it("Should allow for deposit and value should be updated", async function() {
        const {WalletSC2, acc2} = await loadFixture(deployWallets) 

        await WalletSC2.connect(acc2).deposit({value: ethers.parseEther('1')})
        // The deposit function doesn't accept any parameters, it rather only accepts ether.

        const value = await WalletSC2.balances(acc2)
        // Storing value of balance of Account 2

        expect(value).to.equal( ethers.parseEther('1'))
    })

    it("should allow specified amount to be withdrawn", async function () {

        const {WalletSC2, acc2} = await loadFixture(deployWallets) 
        // Call of previous state

        await WalletSC2.connect(acc2).deposit({value: ethers.parseEther('3')})
        await WalletSC2.connect(acc2).withdraw(ethers.parseEther('2'))
        // Deposit and then withdrawal of funds.

        expect(await WalletSC2.balances(acc2)).to.equal(ethers.parseEther('1'))
    })

    it("Refund function should send funds back to the user.",  async function() {
        
        const {WalletSC2, acc2, acc10} = await loadFixture(deployWallets)
        // Call of Previous State

        await WalletSC2.connect(acc2).deposit({value: ethers.parseEther('3')})
        var postDepValue :bigint = await ethers.provider.getBalance(acc2)
        // Value after deposit

        await WalletSC2.connect(acc2).refund()
        var newValue :bigint = await ethers.provider.getBalance(acc2)
        // Value after refund

        var amount : boolean = (newValue > postDepValue) ? true : false
        expect(amount).to.equal(true)
    })
})

describe("Wallet Smart Contract 3", function() {
    it("The person who deployed the contract is the owner", async function() {
        const {WalletSC3, acc1} = await loadFixture(deployWallets)
        
        expect(await WalletSC3.creator()).to.equal(acc1.address)
    })

    it("Should allow for deposit and value should be updated", async function() {
        const {WalletSC3, acc2} = await loadFixture(deployWallets) 

        await WalletSC3.connect(acc2).deposit({value: ethers.parseEther('1')})
        // The deposit function doesn't accept any parameters, it rather only accepts ether.

        const value = await WalletSC3.balances(acc2)
        // Storing value of balance of Account 2

        expect(value).to.equal( ethers.parseEther('1'))
    })

    it("Migrate to function should revert with an error if not called by owner",  async function() {
        
        const {WalletSC3, acc2, acc10} = await loadFixture(deployWallets)
        // Call of Previous State
        
        expect(WalletSC3.connect(acc2).migrateTo(acc10)).to.be.reverted;
    })

})