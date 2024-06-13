require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-verify")
require("dotenv").config();
const { PRIVATE_KEY } = process.env;
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: " http://127.0.0.1:8545/",
    },
    metisSepolia: {
      url: "https://sepolia.metisdevops.link",
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      metisSepolia: "apiKey is not required, just set a placeholder",
    },
    customChains:[ {
      network: "metisSepolia",
      chainId: 59902,
      urls: {
        apiURL:
          "https://api.routescan.io/v2/network/testnet/evm/59902/etherscan",
        browserURL: "https://sepolia.explorer.metisdevops.link/",
      },
    },]
  },

  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
