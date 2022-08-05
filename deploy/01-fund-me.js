const { network } = require("hardhat");
require("dotenv").config();
const { verify } = require("../util/verify");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    ethUsdPriceFeedAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdPriceFeedAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  const args = [ethUsdPriceFeedAddress];
  const FundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHER_SCAN_API_KEY
  ) {
    await verify(FundMe.address, args);
  }
  log("Contract Deployed");
  log("-----------------------------------");
};
module.exports.tags = ["all", "fundme"];
