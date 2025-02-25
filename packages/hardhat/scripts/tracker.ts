import { ethers } from "hardhat";

async function main() {
  const predictionMarketAddress = "0xCF078031f890Ed361442e09ebA6Ec255A47d6E72"; // Replace with your contract address

  // Get the signer (deployer)
  const [deployer] = await ethers.getSigners();

  // ABI for the BetPlaced event
  const predictionMarketAbi = [
    "event BetPlaced(address indexed user, uint256 predictionId, string vote, uint256 amount)",
  ];

  // Connect to the contract using Hardhat's provider
  const contract = new ethers.Contract(predictionMarketAddress, predictionMarketAbi, deployer);

  // Get the block range for the query (example, the latest 1000 blocks)
  const latestBlock = await ethers.provider.getBlockNumber();
  const fromBlock = latestBlock - 1000; // Adjust to query logs in smaller ranges (for pagination)

  // Get BetPlaced events with pagination (fetch 50 at a time)
  const filter = contract.filters.BetPlaced();

  let events: any[] = [];
  const batchSize = 50;
  let currentFromBlock = fromBlock;

  while (currentFromBlock <= latestBlock) {
    const toBlock = Math.min(currentFromBlock + batchSize - 1, latestBlock);

    // Query logs in batches
    const batchEvents = await contract.queryFilter(filter, currentFromBlock, toBlock);

    // Add the events to the list
    events = events.concat(batchEvents);

    // Move to the next block range
    currentFromBlock = toBlock + 1;
  }

  // Fetch only the last 50 events
  const latestEvents = events.slice(-50); // Take the last 50 events

  console.log("Latest 50 Bets Placed:");
  latestEvents.forEach(event => {
    const parsedEvent = contract.interface.parseLog(event);

    // Check if parsedEvent is not null before accessing args
    if (parsedEvent) {
      console.log(`User: ${parsedEvent.args[0]}`);
      console.log(`Prediction ID: ${parsedEvent.args[1]}`);
      console.log(`Vote: ${parsedEvent.args[2]}`);
      console.log(`Amount: ${ethers.formatEther(parsedEvent.args[3])} ETH`);
      console.log("----------------------------");
    }
  });

  console.log(`Total bets tracked: ${latestEvents.length}`);
}

main().catch(console.error);
