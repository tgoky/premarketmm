import { ethers, deployments, getNamedAccounts } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();

  console.log("Deploying contracts with the account:", deployer);

  // Deploy the contract
  const predictionMarketDeployment = await deployments.deploy("PredictionMarketTesnetV1", {
    from: deployer,
    args: ["0xd9f53DCa4EdACb78E97B5a4A30bC39c7b61EE8ad", 2], // Replace with the initial treasury address
    log: true,
  });

  console.log("PredictionMarket deployed at:", predictionMarketDeployment.address);

  // Get the deployed contract instance
  const predictionMarket = await ethers.getContractAt("PredictionMarketTesnetV1", predictionMarketDeployment.address);

  console.log("Contract owner:", await predictionMarket.owner());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
