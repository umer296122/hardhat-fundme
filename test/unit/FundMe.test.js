const { ethers, getNamedAccounts, deployments } = require("hardhat");
const { assert, expect } = require("chai");

describe("FundMe", async function () {
  let FundMe;
  let deployer;
  let mockV3Aggregator;
  let sendValue = ethers.utils.parseEther("1");
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    FundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });
  describe("constructor", async function () {
    it("set aggregator address correctly", async function () {
      const response = await FundMe.priceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });
  describe("fund", async function () {
    it("Fail if you not send enough eth", async function () {
      await expect(FundMe.fund()).to.be.revertedWith("ds");
    });
    it("update the amount of data structure", async function () {
      await FundMe.fund({ value: sendValue });
      const response = await FundMe.addressToAmountFunded(deployer.address);
      assert.equal(response.toString(), sendValue.toString());
    });
    it("add funder to array of funder", async function () {
      await FundMe.fund({ value: sendValue });
      const funder = await FundMe.funders(0);
      assert.equal(funder, deployer);
    });
  });
  describe("withdraw", async function () {
    this.beforeEach(async function () {
      await FundMe.fund({ value: sendValue });
    });
    it("withdra balance", async function () {
      //Arrange
      const startingFundMeBalance = await FundMe.provider.getBalance(
        FundMe.address
      );
      const startingDeployerBalance = await FundMe.provider.getBalance(
        deployer
      );
      //Act
      const txResponce = await FundMe.withdraw();
      const txReceipt = await txResponce.wait(1);
      const { gasUsed, effectiveGasPrice } = txReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);
      const endingFundMeBalance = await FundMe.provider.getBalance(
        FundMe.address
      );
      const endingDeployerBalance = await FundMe.provider.getBalance(deployer);
      //Assert
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );
    });
    it("allow withdraw balance of multiple funders ", async function () {
      //Arrange
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await FundMe.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendValue });
      }
      const startingFundMeBalance = await FundMe.provider.getBalance(
        FundMe.address
      );
      const startingDeployerBalance = await FundMe.provider.getBalance(
        deployer
      );
      //Act
      const txResponce = await FundMe.withdraw();
      const txReceipt = await txResponce.wait(1);
      const { gasUsed, effectiveGasPrice } = txReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);
      const endingFundMeBalance = await FundMe.provider.getBalance(
        FundMe.address
      );
      const endingDeployerBalance = await FundMe.provider.getBalance(deployer);
      //Assert
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );
      await expect(FundMe.funders(0)).to.be.reverted;
      for (let i = 1; i < 6; i++) {
        assert.equal(
          await FundMe.addressToAmountFunded(accounts[i].address),
          0
        );
      }
    });
    it("only onwer allow to withdraw ", async function () {
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];
      const attackerConnectedContract = await FundMe.connect(attacker);
      await expect(attackerConnectedContract.withdraw()).to.be.reverted;
    });
  });
});
