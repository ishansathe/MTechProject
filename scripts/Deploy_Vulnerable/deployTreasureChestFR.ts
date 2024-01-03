import { ethers } from "hardhat"

async function main() {
    const TC = await ethers.getContractFactory("TreasureChest")
    const [add1, add2] = await ethers.getSigners()

    const tc = await TC.connect(add1).deploy()

    console.log(`Target COntract Deployed at : ${tc.target}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode=1
})