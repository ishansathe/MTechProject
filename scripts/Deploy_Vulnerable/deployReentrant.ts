import { ethers } from "hardhat";

async function main(){

    const vuln = await ethers.deployContract("Vulnerable")
    await vuln.waitForDeployment()

    const expl = await ethers.deployContract("Exploit")
    await expl.waitForDeployment()

    const [, , , , , , , acc8] = await ethers.getSigners()

    await acc8.sendTransaction({ to: vuln.target, value: ethers.parseEther("1")})
    
}

main().catch((error) => {
    console.error(error)
    process.exitCode=1
})