// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IEquityToken} from "./interfaces/IEquityToken.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IWhitelistManager} from "./interfaces/IWhitelistManager.sol";
import {ReentrancyGuard} from "./utils/ReentrancyGuard.sol";
contract EquityVesting is Initializable,ReentrancyGuard {

    IEquityToken private token;
    IWhitelistManager private whitelistManager;
    uint256 public constant CXO_AMOUNT = 1000;
    uint256 public constant SENIOR_MANAGER_AMOUNT = 800;
    uint256 public constant OTHER_AMOUNT = 400;
    uint256 public constant ONE_YEAR = 365 days;
    address public owner;

    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 cliffPeriodEnd;
        uint256 vestingDuration;
        uint256 releasePercentage;
    }

    mapping(address => VestingSchedule) public vestingSchedules;
    event TokensReleased(address beneficiary, uint256 amount);
    modifier onlyOwner() {
        require(owner == msg.sender, "YOU_ARE_NOT_OWNER");
        _;
    }
    function initialize(address _owner,address _token,address _whitelistManager) public initializer {
        owner = _owner;
        token = IEquityToken(_token);
        whitelistManager = IWhitelistManager(_whitelistManager);
    }

    constructor(address _token, address _whitelistManager) {
        token = IEquityToken(_token);
        owner = msg.sender;
        whitelistManager = IWhitelistManager(_whitelistManager);
    }

    function grantEquity(address employee) external onlyOwner {
        require(
            vestingSchedules[employee].totalAmount == 0,
            "EQUITY_ALREADY_GRANTED"
        );
       
        uint256 amount;
        uint256 vestingPeriod;
        uint256 _releasePercentage;
        if (whitelistManager.isCXO(employee)) {
            amount = CXO_AMOUNT;
            vestingPeriod = 4 * ONE_YEAR;
            _releasePercentage = amount / 4;
        } else if (whitelistManager.isSeniorManager(employee)) {
            amount = SENIOR_MANAGER_AMOUNT;
            vestingPeriod = 4 * ONE_YEAR;
            _releasePercentage = amount / 4;
        } else if (whitelistManager.isWhitelistUser(employee)) {
            amount = OTHER_AMOUNT;
            vestingPeriod = 2 * ONE_YEAR;
            _releasePercentage = amount / 2;
        } else {
            revert("EMPLOYEE_NOT_IN_EQUITY_CLASS");
        }

        vestingSchedules[employee] = VestingSchedule({
            totalAmount: amount,
            releasedAmount: 0,
            startTime: block.timestamp,
            cliffPeriodEnd: ONE_YEAR,
            vestingDuration: vestingPeriod,
            releasePercentage: _releasePercentage
        });
    }

    function unlockEquity(address employee) external nonReentrant {
        VestingSchedule storage schedule = vestingSchedules[employee];
        require(schedule.totalAmount > 0, "NO_EQUITY_GRANTED");
        require(
            block.timestamp >= schedule.startTime + schedule.cliffPeriodEnd,
            "CLIFF_PERIOD_NOT_OVER_YET"
        );
        uint256 releasableAmount = _calculateRelasableAmount(
            schedule.startTime,
            schedule.cliffPeriodEnd,
            schedule.releasePercentage,
            schedule.releasedAmount
        );
        require(releasableAmount > 0, "NO_TOKENS_TO_RELEASE");
        schedule.releasedAmount += releasableAmount;
        require(
            token.transfer(employee, releasableAmount*(10**18)),
            "TOKEN_NOT_TRANSFER_SUCCESSFULLY"
        );

        emit TokensReleased(employee,releasableAmount);
        schedule.totalAmount -= releasableAmount;
    }

    function unlockedBalance(address employee) external view returns (uint256) {
        VestingSchedule storage schedule = vestingSchedules[employee];
        if (
            schedule.totalAmount == 0 ||
            block.timestamp < schedule.startTime + schedule.cliffPeriodEnd
        ) {
            return 1;
        }

        return
            _calculateRelasableAmount(
                schedule.startTime,
                schedule.cliffPeriodEnd,
                schedule.releasePercentage,
                schedule.releasedAmount
            );
    }

    function _calculateRelasableAmount(
        uint256 _startTime,
        uint256 _cliffPeriodEnd,
        uint256 _releasePercentage,
        uint256 _releasedAmount
    ) private view returns (uint256) {
        uint256 periodsElapsed = (block.timestamp -
            _startTime -
            _cliffPeriodEnd) / ONE_YEAR;
        uint256 releasableAmount = periodsElapsed *
            _releasePercentage -
            _releasedAmount;

        return releasableAmount;
    }
}
