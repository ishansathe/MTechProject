import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("Multiple Wallet Contracts", function() {

    async function deployWallets() {
        const [acc1, acc2,,,,,,,,acc10] = await ethers.getSigners()

        const falseCons = await ethers.deployContract("FalseConsWallet");
        await falseCons.waitForDeployment();

        const noSubWallet = await ethers.deployContract("NoSubWallet");
        await noSubWallet.waitForDeployment();
        await noSubWallet.connect(acc10).deposit({value: ethers.parseEther('300')})


        const newWrongSign = await ethers.deployContract("NewWrongSignWallet");
        await newWrongSign.waitForDeployment()
        await newWrongSign.connect(acc10).deposit({value: ethers.parseEther('500')})

        const oldWrongSign = await ethers.deployContract("OldWrongSignWallet")
        await oldWrongSign.waitForDeployment()
        await oldWrongSign.connect(acc10).deposit({value: ethers.parseEther('500')})


        return {falseCons, noSubWallet, newWrongSign, oldWrongSign, acc1, acc2, acc10}
    }
    describe("Wallet with False Constructor", function() {
        it("should not have a creator", async function() {
            const {falseCons, acc1} = await loadFixture(deployWallets)

            expect(await falseCons.creator()).to.not.equal(acc1.address)
        })
    })

    describe("Wallet with no subtraction on refund", function () {
        it("should have some funds by default ", async function() {
            const {noSubWallet, acc10} = await loadFixture(deployWallets)
            expect(await ethers.provider.getBalance(noSubWallet)).to.not.equal(0)
        })

        it("funds should be from acc10 (as per deployment script)", async function() {
            const {noSubWallet, acc10} = await loadFixture(deployWallets)
            const amountInEth = ethers.parseEther('300') //Although we could directly use this, this seemed cleaner.

            expect(await noSubWallet.balances(acc10.address)).to.equal(amountInEth)
        })

        it("should allow for others to deposit and value should be updated", async function () {
            const {noSubWallet, acc2} = await loadFixture(deployWallets)

            await noSubWallet.connect(acc2).deposit({
                value:ethers.parseEther('2')
            })
            const etherTwo = ethers.parseEther('2')

            expect(await noSubWallet.balances(acc2.address)).to.equal(etherTwo)
        })
        it("Refund function can be called multiple times", async function () {
            const {noSubWallet, acc2} = await loadFixture(deployWallets)
            
            await noSubWallet.connect(acc2).deposit({
                value:ethers.parseEther('2')
            })
            
            await noSubWallet.connect(acc2).refund()
            await noSubWallet.connect(acc2).refund()

            expect(await noSubWallet.balances(acc2.address)).to.equal(ethers.parseEther('2'))
            //We just got to know the value after one execution then hard coded it to check
        })
    })
    describe("Old compiler wallet with wrong sign", function() {
        it("should have some funds by default ", async function() {
            const {oldWrongSign, acc10} = await loadFixture(deployWallets)
            expect(await ethers.provider.getBalance(oldWrongSign)).to.not.equal(0)
        })

        it("funds should be from acc10 (as per deployment script)", async function() {
            const {oldWrongSign, acc10} = await loadFixture(deployWallets)
            const amountInEth = ethers.parseEther('500') //Although we could directly use this, this seemed cleaner.

            expect(await oldWrongSign.balances(acc10.address)).to.equal(amountInEth)
        })

        it("should allow for others to deposit and value should be updated", async function () {
            const {oldWrongSign, acc2} = await loadFixture(deployWallets)

            await oldWrongSign.connect(acc2).deposit({
                value:ethers.parseEther('2')
            })
            const etherTwo = ethers.parseEther('2')

            expect(await oldWrongSign.balances(acc2.address)).to.equal(etherTwo)
        })

        it("should allow for value higher than balance of sender and lesser than balance of contract to be withdrawn",async function() {
            const {oldWrongSign, acc2} = await loadFixture(deployWallets)
            const ether400 = ethers.parseEther('400')
            await oldWrongSign.connect(acc2).withdraw(ether400)

            expect(await ethers.provider.getBalance(acc2.address)).to.equal(10399999931426100824150n)
            //Again the value is seen before by executing once and then hardcoded here.
            //Though, it is indeed 400 ether that is withdrawn. The lesser amount is due to transaction fees.
        })

        it("should end up with an overflow", async function main() {
            const {oldWrongSign, acc2} = await loadFixture(deployWallets)
            const ether400 = ethers.parseEther('400')
            await oldWrongSign.connect(acc2).withdraw(ether400)

            expect(await oldWrongSign.balances(acc2.address)).to.equal(
                115792089237316195423570985008687907853269984665640564039057584007913129639936n
                )
        })
    })

    describe("New compiler wallet with wrong sign", function() {
        it("should have some funds by default ", async function() {
            const {newWrongSign, acc10} = await loadFixture(deployWallets)
            expect(await ethers.provider.getBalance(newWrongSign)).to.not.equal(0)
        })

        it("funds should be from acc10 (as per deployment script)", async function() {
            const {newWrongSign, acc10} = await loadFixture(deployWallets)
            const amountInEth = ethers.parseEther('500') //Although we could directly use this, this seemed cleaner.

            expect(await newWrongSign.balances(acc10.address)).to.equal(amountInEth)
        })

        it("should allow for others to deposit and value should be updated", async function () {
            const {newWrongSign, acc2} = await loadFixture(deployWallets)

            await newWrongSign.connect(acc2).deposit({
                value:ethers.parseEther('2')
            })
            const etherTwo = ethers.parseEther('2')

            expect(await newWrongSign.balances(acc2.address)).to.equal(etherTwo)
        })

        it("should allow for value higher than balance of sender and lesser than balance of contract to be withdrawn",async function() {
            const {newWrongSign, acc2} = await loadFixture(deployWallets)
            const ether400 = ethers.parseEther('400')
            await newWrongSign.connect(acc2).withdraw(ether400)

            expect(await ethers.provider.getBalance(acc2.address)).to.equal(10399999931173847078780n)
            //Again the value is seen before by executing once and then hardcoded here.
            //Though, it is indeed 400 ether that is withdrawn. The lesser amount is due to transaction fees.
        })

        it("should end up with an overflow", async function main() {
            const {newWrongSign, acc2} = await loadFixture(deployWallets)
            const ether400 = ethers.parseEther('400')
            await newWrongSign.connect(acc2).withdraw(ether400)

            expect(await newWrongSign.balances(acc2.address)).to.equal(
                115792089237316195423570985008687907853269984665640564039057584007913129639936n
                )
        })
    })
})