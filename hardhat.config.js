require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
// require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
// require("./tasks/block-number.js");
require("hardhat-gas-reporter");
require("solidity-coverage");
// /** @type import('hardhat/config').HardhatUserConfig */
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || "https://eth-rinkbey/";
const PRIVATE_KEY = process.env.RINKEBY_KEY || "0xkey";
const ETHER_SCAN_API_KEY = process.env.ETHER_SCAN_API_KEY || "key";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key";
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
      blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.8",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  etherscan: {
    apiKey: ETHER_SCAN_API_KEY,
  },
  gasReporter: {
    enable: true,
    outputFile: "gas-reporter.txt",
    noColours: true,
    currenct: "USD",
    // coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    users: {
      default: 1,
    },
  },
};
