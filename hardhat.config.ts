
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-ignition"

import * as dotenv from "dotenv"

import { HardhatUserConfig } from "hardhat/types";

dotenv.config()

const acc1 = process.env.SEPOLIA_ACC1_PRIVATE_KEY
const acc2 = process.env.SEPOLIA_ACC2_PRIVATE_KEY
//Change made in 'node_modules/@types/node/globals.d.ts'


/** @type import('hardhat/config').HardhatUserConfig */

const config : HardhatUserConfig = {
  solidity: { compilers : 
    [
      {version : "0.8.19"}, 
      {version : "0.4.24"}
    ]
  },

  networks : {
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_ENDPOINT,
      accounts : [acc1, acc2]
    },

    hardhat : {
      gas : "auto",
      mining:{
        auto:true,
        interval : 0 //change when needed
      },
    }
  } 
};

export default config


//@ts-ignore
task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")  //@ts-ignore
  .setAction(async (taskArgs) => {          //@ts-ignore
    const balance = await ethers.provider.getBalance(taskArgs.account);
       //@ts-ignore
    console.log(ethers.formatEther(balance), "ETH");
  });

  //@ts-ignore
task("Deploy", "Deploys the given contract")
  .addParam("contract", "Name of contract")     //@ts-ignore
  .setAction(async (taskArgs) => {
    //@ts-ignore
    const dp = await ethers.getContractFactory(taskArgs.contract);
    const deployed  = await dp.deploy();

    console.log(`Contract deployed at ${deployed.target}`);
  })