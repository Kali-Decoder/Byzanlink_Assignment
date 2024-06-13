const { ethers } = require("hardhat");

async function testRPC() {
  const provider = new ethers.providers.JsonRpcProvider("https://zetachain-testnet-rpc.itrocket.net");
    console.log("Provider:", provider);
  try {
    const chainId = await provider.send("eth_chainId", []);
    console.log("Chain ID:", chainId);
  } catch (error) {
    console.error("Error:", error);
  }

  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("Block Number:", blockNumber);
  } catch (error) {
    console.error("Error:", error);
  }
}

testRPC();