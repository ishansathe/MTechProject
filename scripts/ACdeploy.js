

//Importing hardhat not required
//Since hre is globally there for all scripts.

async function main() {
    const AC = await ethers.getContractFactory("AssertConstructor");
    
    const ac = await AC.deploy();

    console.log(`Contract deployed at ${ac.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode=1;
})