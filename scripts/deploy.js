const hre = require("hardhat");
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const EquityToken = await hre.ethers.getContractFactory("TestEquityToken");
  const equityToken = await EquityToken.deploy();

  let EquityTokenAddress = equityToken.address;

  const WhiteListManager = await hre.ethers.getContractFactory(
    "WhitelistManager"
  );
  const whiteListManager = await WhiteListManager.deploy();

  let WhiteListManagerAddress = whiteListManager.address;

  console.log("EquityToken deployed to:", EquityTokenAddress);
  console.log("WhiteListManager deployed to:", WhiteListManagerAddress);

  await sleep(5000);
  console.log("Deploying EquityVesting...");
  const EquityVesting = await hre.ethers.getContractFactory("EquityVesting");
  const equityVesting = await EquityVesting.deploy(
    EquityTokenAddress,
    WhiteListManagerAddress
  );

  let EquityVestingAddress = equityVesting.address;

  console.log("EquityVesting deployed to:", EquityVestingAddress);

  // await hre.run("verify:verify", {
  //   address: EquityTokenAddress,
  //   constructorArguments: [],
  // });

  await hre.run("verify:verify", {
    address: EquityVestingAddress,
    constructorArguments: [EquityTokenAddress, WhiteListManagerAddress],
  });

  // await hre.run("verify:verify", {
  //   address: WhiteListManagerAddress,
  //   constructorArguments: [],
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
