import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0xCF078031f890Ed361442e09ebA6Ec255A47d6E72"; // Replace with your contract's address
  const [deployer] = await ethers.getSigners();

  console.log("Running script with the account:", deployer.address);

  // Get the contract instance
  const predictionMarket = await ethers.getContractAt("PredictionMarket5", contractAddress);

  console.log("Withdrawing excess funds from the contract...");

  // Call the handleExcessFunds function with "withdraw" action
  const tx = await predictionMarket.handleExcessFunds("withdraw");

  // Wait for the transaction to be mined
  await tx.wait();

  console.log("Excess funds successfully withdrawn.");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
