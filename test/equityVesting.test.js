const { expect, assert } = require("chai");
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
function getSecondsOfDays(day) {
  return day * 24 * 60 * 60;
}

const { ethers } = require("hardhat");

describe("Equity-Vesting", function () {
  async function runEveryTime() {
    const [cxo, senior, employee, other] = await ethers.getSigners();

    // TOKEN SETUP
    const testEquityTokenContract = await ethers.getContractFactory(
      "TestEquityToken"
    );
    const testEquityToken = await testEquityTokenContract.deploy();
    const testEquityTokenAddress = testEquityToken.address;
    console.log("Test EquityToken deployed.", testEquityTokenAddress);

    // WHITELISTER SETUP
    const whitelistManagerContract = await ethers.getContractFactory(
      "WhitelistManager"
    );
    const whitelistManager = await whitelistManagerContract
      .connect(cxo)
      .deploy();
    const whitelistManagerAddress = whitelistManager.address;

    // MAIN Equity Vesting SETUP
    const equityVestingContract = await ethers.getContractFactory(
      "EquityVesting"
    );
    const EquityVesting = await equityVestingContract
      .connect(cxo)
      .deploy(testEquityTokenAddress, whitelistManagerAddress);

    const equityVestingAddress = EquityVesting.address;

    console.log("Equity Vesting deployed at : ", equityVestingAddress);
    // Assigning Roles
    await whitelistManager.connect(cxo).addSeniorManagerRole(senior.address);
    await whitelistManager.connect(cxo).addUserWhitelisted(employee.address);

    return {
      EquityVesting,
      testEquityToken,
      whitelistManager,
      cxo,
      senior,
      employee,
      other,
    };
  }

  // ! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // ! DEPLOYMENT TESTS
  // ! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  describe("Deployment", async () => {
    it("[Deployment] : Should initiate the contract with provided Equity Token address", async () => {
      const { testEquityToken } = await loadFixture(runEveryTime);
      expect(await testEquityToken.name()).to.not.null;
    });
    it("[Deployment] : Should initiate the contract with provided Whitelist Manager address", async () => {
      const { whitelistManager } = await loadFixture(runEveryTime);
      expect(await whitelistManager.address).to.not.null;
    });
    it("[Depoloyment] : Should identify the correct owner", async () => {
      const { EquityVesting, cxo } = await loadFixture(runEveryTime);
      expect(await EquityVesting.owner()).equal(cxo.address);
    });

    it("[Deployment] : Should call grantEquity Not by Owner", async () => {
      const { EquityVesting, testEquityToken, employee } = await loadFixture(
        runEveryTime
      );
      await expect(
        EquityVesting.connect(employee).grantEquity(employee.address)
      ).revertedWith("YOU_ARE_NOT_OWNER");
    });

    it("[Deployment] : Should call grantEquity by Owner but address is not fall in any class", async () => {
      const { EquityVesting, testEquityToken, other, cxo } = await loadFixture(
        runEveryTime
      );
      await expect(
        EquityVesting.connect(cxo).grantEquity(other.address)
      ).revertedWith("EMPLOYEE_NOT_IN_EQUITY_CLASS");
    });

 

    it("[Deployment] : Should Owner grants Equity to employee and check the balance", async () => {
      const { EquityVesting, testEquityToken, employee, cxo } =
        await loadFixture(runEveryTime);
      await EquityVesting.connect(cxo).grantEquity(employee.address);
      let data = await EquityVesting.vestingSchedules(employee.address);

      expect(+data[0]).to.equal(400);
    });

    it("[Deployment] : Should Owner grants Equity to CXO and check the balance", async () => {
      const { EquityVesting, testEquityToken, employee, cxo } =
        await loadFixture(runEveryTime);
      await EquityVesting.connect(cxo).grantEquity(cxo.address);
      let data = await EquityVesting.vestingSchedules(cxo.address);
      expect(+data[0]).to.equal(1000);
    });

    it("[Deployment] : Should Owner grants Equity to Senior Manager and check the balance", async () => {
      const { EquityVesting, testEquityToken, employee, cxo, senior } =
        await loadFixture(runEveryTime);
      await EquityVesting.connect(cxo).grantEquity(senior.address);
      let data = await EquityVesting.vestingSchedules(senior.address);
      expect(+data[0]).to.equal(800);
    });

    it("[Deployment] : Should gives unlock balance of the user", async () => {
      const { EquityVesting, testEquityToken, employee, cxo } =
        await loadFixture(runEveryTime);
      await EquityVesting.connect(cxo).grantEquity(employee.address);

      const unlockTime = (await time.latest()) + getSecondsOfDays(366);

      await time.increaseTo(unlockTime);

      let balance = await EquityVesting.unlockedBalance(employee.address);
      console.log("Balance : ", balance);

    });

  });
});
