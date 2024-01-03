import {ethers} from "hardhat"

async function main() {
    const vuln = await ethers.deployContract("txOrigin")
    await vuln.waitForDeployment()
    //By default, always acc1 deploys so im ignoring that for now

    const [acc1] = await ethers.getSigners()

    await acc1.sendTransaction({to: vuln.target, value : ethers.parseEther('1') })

    console.log(`txOrigin contract has been deployed at : ${vuln.target}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode=1
})