import { ethers } from "hardhat";

async function main() {
    
    console.log("")
    const library = await ethers.getContractFactory("delegateLibrary")
    const delLibrary = await library.deploy()
    console.log(`The library to be called is deployed at ${delLibrary.target}`)


    const delegator = await ethers.deployContract("VulnDelegator", [delLibrary.target])
    await delegator.waitForDeployment()
    console.log(`The vulnerable contract that delegate calls the library is deployed at ${delegator.target}`)
    console.log("")

    //Choosing not to deploy the attacker contract here.
}

main().catch((error) => {
    console.error(error)
    process.exitCode=1
})