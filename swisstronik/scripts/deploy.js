const hre = require("hardhat");

async function main() {
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const CoFinanceFactory = await hre.ethers.getContractFactory("CoFinanceFactory");
  console.log("Deploying CoFinanceFactory...");
  const coFinanceFactory = await CoFinanceFactory.deploy();
  //console.log(coFinanceFactory)

  await coFinanceFactory.deploymentTransaction().wait(6);
  console.log(`CoFinanceFactory contract deployed to ${coFinanceFactory.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
