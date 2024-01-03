import {ethers} from "hardhat";

async function main() {
    
    const [acc1, acc2,,,,,,,,acc10] = await ethers.getSigners()

    const falseCons = await ethers.deployContract("FalseConsWallet");
    await falseCons.waitForDeployment();
    console.log(`FalseConstructor Wallet deployed at: ${falseCons.target}`)


    const noSubWallet = await ethers.deployContract("NoSubWallet");
    await noSubWallet.waitForDeployment();
    console.log(`No subtraction wallet is deployed at: ${noSubWallet.target}`)
    await noSubWallet.connect(acc10).deposit({value: ethers.parseEther('300')})


    const newWrongSign = await ethers.deployContract("NewWrongSignWallet");
    await newWrongSign.waitForDeployment()
    console.log(`New Wrong Sign Wallet has been deployed to : ${newWrongSign.target}`)


    const oldWrongSign = await ethers.deployContract("OldWrongSignWallet")
    await oldWrongSign.waitForDeployment()
    console.log(`Older Wrong Sign wallet has been deployed at: ${oldWrongSign.target}`)

}

main().catch((error) => {
    console.error(error)
    process.exitCode=1
})