require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 800 // Adjust the number of runs as needed
      }
    }
  },
  networks: {
    planq: {
      url: "https://evm-rpc-atlas.planq.network",
      accounts: [""],
      chainId: 7077 // Replace with the actual chain ID of Swisstronik testnet
    },
  },
  sourcify: {
    enabled: true
  }
};
