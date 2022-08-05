const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("fund Contract ........");
  const txResponce = await fundMe.fund({
    value: ethers.utils.parseEther("0.1"),
  });
  await txResponce.wait(1);
  console.log("funded ........");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
