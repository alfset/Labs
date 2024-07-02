// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract ComunyFiLend {
    struct LendingToken {
        address lenderToken;
        address collateralToken;
        uint256 totalLent;
        uint256 totalBorrowed;
        uint256 totalInterestAccrued;
        uint256 totalFeeCollected;
        uint256 collateralRatio; // Ratio multiplied by 100 (e.g., 200 for 2%)
        uint256 totalValueLocked; // Total Value Locked (TVL) for lender token and collateral token
    }

    mapping(address => LendingToken) public lendingTokens;
    mapping(address => mapping(address => uint256)) public lenderShares;
    mapping(address => uint256) public totalShares;
    mapping(address => bool) public isCollateralToken;
    address[] public collateralTokens;
    mapping(address => address[]) internal lenders;
    uint256 public liquidationThreshold = 80; // Liquidation threshold in percentage

    event InterestAccrued(address tokenAddress, uint256 amount);
    event FeeCollected(address tokenAddress, uint256 amount);
    event InterestPaid(address tokenAddress, address lender, uint256 amount);
    event CollateralTokenAdded(address tokenAddress);
    event CollateralTokenRemoved(address tokenAddress);
    event Liquidation(address tokenAddress, address lender, uint256 amount);

    modifier onlyCollateralToken(address tokenAddress) {
        require(isCollateralToken[tokenAddress], "Token is not a valid collateral");
        _;
    }

    constructor() {
        lendingTokens[address(0)].collateralRatio = 200;
    }

    function lend(address tokenAddress, uint256 amount) external payable {
        require(msg.value == 0, "ETH not supported for lending");

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);

        LendingToken storage token = lendingTokens[tokenAddress];
        token.totalLent += amount;

        uint256 currentShare = amount;
        lenderShares[tokenAddress][msg.sender] += currentShare;
        totalShares[tokenAddress] += currentShare;

        if (!isLenderInArray(tokenAddress, msg.sender)) {
            lenders[tokenAddress].push(msg.sender);
        }

        token.totalValueLocked += amount;
    }

    function withdraw(address tokenAddress, uint256 amount) external {
        LendingToken storage token = lendingTokens[tokenAddress];
        require(amount <= token.totalLent, "Not enough tokens lent");

        uint256 currentShare = amount;
        lenderShares[tokenAddress][msg.sender] -= currentShare;
        totalShares[tokenAddress] -= currentShare;

        IERC20(tokenAddress).transfer(msg.sender, amount);

        token.totalLent -= amount;

        token.totalValueLocked -= amount;
    }

    function borrow(uint256 amount, address tokenAddress) external onlyCollateralToken(tokenAddress) {
        LendingToken storage token = lendingTokens[tokenAddress];
        require(amount <= (token.totalValueLocked * liquidationThreshold) / 100, "Exceeds borrowing limit based on TVL");

        token.totalBorrowed += amount;
        IERC20(tokenAddress).transfer(msg.sender, amount);
    }

    function payDebt(address tokenAddress, uint256 amount) external {
        LendingToken storage token = lendingTokens[tokenAddress];
        require(amount <= token.totalBorrowed, "Not enough debt to pay");

        token.totalBorrowed -= amount;
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
    }

    function accrueInterest(address tokenAddress, uint256 amount) external {
        LendingToken storage token = lendingTokens[tokenAddress];
        token.totalInterestAccrued += amount;
        emit InterestAccrued(tokenAddress, amount);
    }

    function collectFee(address tokenAddress, uint256 amount) external {
        LendingToken storage token = lendingTokens[tokenAddress];
        token.totalFeeCollected += amount;
        emit FeeCollected(tokenAddress, amount);
    }

    function distributeInterest(address tokenAddress) external {
        require(totalShares[tokenAddress] > 0, "No lenders to distribute interest to");

        LendingToken storage token = lendingTokens[tokenAddress];
        uint256 totalInterest = token.totalInterestAccrued;

        for (uint256 i = 0; i < lenders[tokenAddress].length; i++) {
            address lender = lenders[tokenAddress][i];
            uint256 share = lenderShares[tokenAddress][lender];
            uint256 interestToPay = (totalInterest * share) / totalShares[tokenAddress];

            // Pay interest to lender
            IERC20(tokenAddress).transfer(lender, interestToPay);
            emit InterestPaid(tokenAddress, lender, interestToPay);
        }

        token.totalInterestAccrued = 0;
    }

    function addCollateralToken(address tokenAddress) external {
        require(!isCollateralToken[tokenAddress], "Token is already a collateral token");

        isCollateralToken[tokenAddress] = true;
        collateralTokens.push(tokenAddress);
        emit CollateralTokenAdded(tokenAddress);
    }

    function removeCollateralToken(address tokenAddress) external {
        require(isCollateralToken[tokenAddress], "Token is not a collateral token");

        isCollateralToken[tokenAddress] = false;
        for (uint256 i = 0; i < collateralTokens.length; i++) {
            if (collateralTokens[i] == tokenAddress) {
                delete collateralTokens[i];
                break;
            }
        }
        emit CollateralTokenRemoved(tokenAddress);
    }

    function initializeTokens(address lenderToken, address collateralToken) external {
        require(!isCollateralToken[collateralToken], "Token is already a collateral token");

        isCollateralToken[collateralToken] = true;
        collateralTokens.push(collateralToken);

        lendingTokens[lenderToken].lenderToken = lenderToken;
        lendingTokens[lenderToken].collateralToken = collateralToken;

        lendingTokens[lenderToken].totalValueLocked = 0;
        lendingTokens[collateralToken].totalValueLocked = 0;
    }

    function setLiquidationThreshold(uint256 _threshold) external {
        require(_threshold > 0 && _threshold <= 100, "Invalid threshold value");
        liquidationThreshold = _threshold;
    }

    function isLenderInArray(address tokenAddress, address lender) internal view returns (bool) {
        for (uint256 i = 0; i < lenders[tokenAddress].length; i++) {
            if (lenders[tokenAddress][i] == lender) {
                return true;
            }
        }
        return false;
    }

    function setTotalValueLocked(address tokenAddress, uint256 newTVL) external {
        lendingTokens[tokenAddress].totalValueLocked = newTVL;
    }

    function setInterestRate(address tokenAddress, uint256 newInterestRate) external {

    }

    function liquidate(address tokenAddress, address lender) external {
        LendingToken storage token = lendingTokens[tokenAddress];
        uint256 amountToLiquidate = lenderShares[tokenAddress][lender];
        require(amountToLiquidate > 0, "Lender has no funds to liquidate");

        emit Liquidation(tokenAddress, lender, amountToLiquidate);
    }
}
