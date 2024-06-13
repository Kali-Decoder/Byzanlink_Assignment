const hre = require("hardhat");
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const EquityToken = await hre.ethers.deployContract("TestEquityToken");
  await EquityToken.waitForDeployment();

  let EquityTokenAddress = EquityToken.target;

  const WhiteListManager = await hre.ethers.deployContract("WhitelistManager");
  await WhiteListManager.waitForDeployment();

  let WhiteListManagerAddress = WhiteListManager.target;

  console.log("EquityToken deployed to:", EquityTokenAddress);
  console.log("WhiteListManager deployed to:", WhiteListManagerAddress);

  await sleep(5000);
  console.log("Deploying EquityVesting...");

  const EquityVesting = await hre.ethers.deployContract("EquityVesting", [
    EquityTokenAddress,
    WhiteListManagerAddress,
  ]);
  await EquityVesting.waitForDeployment();

  let EquityVestingAddress = EquityVesting.target;

  console.log("EquityVesting deployed to:", EquityVestingAddress);

  await hre.run("verify:verify", {
    address: EquityTokenAddress,
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: EquityVestingAddress,
    constructorArguments: [EquityTokenAddress, WhiteListManagerAddress],
  });

  await hre.run("verify:verify", {
    address: WhiteListManagerAddress,
    constructorArguments: [],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
