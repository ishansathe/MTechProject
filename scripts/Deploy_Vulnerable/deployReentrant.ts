import { ethers } from "hardhat";

async function main(){

    const vuln = await ethers.deployContract("Vulnerable")
    await vuln.waitForDeployment()

    const [, acc2 , , , , , , acc8] = await ethers.getSigners()

    await acc2.sendTransaction({ to: vuln.target, value: ethers.parseEther("0.00001")})

    console.log(`Vulnerable Contract Deployed at : ${vuln.target}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode=1
})