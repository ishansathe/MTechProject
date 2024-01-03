const hre = require("hardhat");

async function main() {
    const name = "Ishan";
    const GD = await hre.ethers.deployContract("GoodDay", [name]);
    await network.provider.send("evm_mine");

    const gd = await GD.waitForDeployment();
    await network.provider.send("evm_mine");
    //We are yet to learn how to send function values in the 'getContractFactory' function
    //For now, this is the one that works.

    console.log(`Good Day contract has been deployed at ${GD.target}`);

    await gd.changeName("No Lie", { gasLimit : 3000000, gasPrice : 769228700});
    await gd.changeName("Damn", { gasLimit : 3000000, gasPrice : 76922656400});
    

    await network.provider.send("evm_mine");

    var result = await gd.wishMe();
    console.log(`The returned greeting is : ${result}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});