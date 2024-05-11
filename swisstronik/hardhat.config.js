require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');


module.exports = {
  solidity: "0.8.0",
  sourcify: {
    enabled: true
  },
  networks: {
    swisstronik: {
      url: "https://json-rpc.testnet.swisstronik.com/", 
      accounts: ["0xd5848e92a1f33c3155d06988220b5e4091680ce96dfc3887cf0e7b9fd04e741f"], 
    },
  },
};