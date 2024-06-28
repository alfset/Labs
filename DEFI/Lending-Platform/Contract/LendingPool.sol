// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./erc20.sol";
import "./Ownable.sol";

contract LendingPool is Ownable {
    ERC20 public lendingToken;
    ERC20 public collateralToken;
    uint256 public totalLendingDeposits;
    uint256 public totalCollateralDeposits;
    uint256 public totalLoans;
    uint256 public depositFee = 10; // 0.1% deposit fee (10 / 10000)
    uint256 public feeDenominator = 10000;
    uint256 public currentInterestRate; // in percentage, e.g., 5 means 5%
    uint256 public minInterestRate = 0.1 * 100; // minimum 0.1%
    uint256 public maxInterestRate = 50 * 100; // maximum 50%
    uint256 public accumulatedInterest;

    struct Loan {
        uint256 amount;
        uint256 interestRate;
        uint256 duration;
        uint256 collateralAmount;
        bool isActive;
    }

    mapping(address => uint256) public lendingDeposits;
    mapping(address => uint256) public collateralDeposits;
    mapping(address => Loan[]) public loans;

    event LendingDeposit(address indexed user, uint256 amount);
    event CollateralDeposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Borrow(address indexed user, uint256 amount, uint256 collateralAmount);
    event Repay(address indexed user, uint256 amount);
    event Liquidate(address indexed user);
    event InterestRateUpdated(uint256 newInterestRate);

    constructor(address _lendingToken, address _collateralToken, address _owner, uint256 _initialInterestRate) {
        lendingToken = ERC20(_lendingToken);
        collateralToken = ERC20(_collateralToken);
        setInterestRate(_initialInterestRate);
        transferOwnership(_owner); // Set the owner to the passed address
    }

    function setInterestRate(uint256 newInterestRate) public onlyOwner {
        require(newInterestRate >= minInterestRate && newInterestRate <= maxInterestRate, "Interest rate must be between min and max rate");
        currentInterestRate = newInterestRate;
        emit InterestRateUpdated(newInterestRate);
    }

    function depositLending(uint256 amount) external {
        uint256 fee = (amount * depositFee) / feeDenominator;
        uint256 amountAfterFee = amount - fee;

        lendingToken.transferFrom(msg.sender, address(this), amount);
        lendingDeposits[msg.sender] += amountAfterFee;
        totalLendingDeposits += amountAfterFee;

        emit LendingDeposit(msg.sender, amountAfterFee);
    }

    function depositCollateral(uint256 amount) external {
        collateralToken.transferFrom(msg.sender, address(this), amount);
        collateralDeposits[msg.sender] += amount;
        totalCollateralDeposits += amount;

        emit CollateralDeposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(lendingDeposits[msg.sender] >= amount, "Insufficient balance");
        lendingDeposits[msg.sender] -= amount;
        totalLendingDeposits -= amount;
        lendingToken.transfer(msg.sender, amount);
        emit Withdraw(msg.sender, amount);
    }

    function borrow(uint256 amount, uint256 duration) external {
        uint256 collateralAmount = amount; // 1:1 collateral ratio
        require(collateralDeposits[msg.sender] >= collateralAmount, "Insufficient collateral");

        collateralDeposits[msg.sender] -= collateralAmount;
        totalCollateralDeposits -= collateralAmount;

        loans[msg.sender].push(Loan(amount, currentInterestRate, duration, collateralAmount, true));
        totalLoans += amount;
        lendingToken.transfer(msg.sender, amount);
        emit Borrow(msg.sender, amount, collateralAmount);
    }

    function repay(uint256 loanIndex, uint256 amount) external {
        require(loanIndex < loans[msg.sender].length, "Invalid loan index");
        Loan storage loan = loans[msg.sender][loanIndex];
        require(loan.isActive, "No active loan");

        uint256 interest = (loan.amount * loan.interestRate) / 100;
        uint256 totalRepayment = loan.amount + interest;
        require(amount >= totalRepayment, "Repay full amount including interest");

        loan.isActive = false;
        totalLoans -= loan.amount;
        accumulatedInterest += interest;
        lendingToken.transferFrom(msg.sender, address(this), totalRepayment);
        collateralToken.transfer(msg.sender, loan.collateralAmount);

        emit Repay(msg.sender, amount);
    }

    function getRepaymentAmount(address user, uint256 loanIndex) external view returns (uint256) {
        require(loanIndex < loans[user].length, "Invalid loan index");
        Loan storage loan = loans[user][loanIndex];
        uint256 interest = (loan.amount * loan.interestRate) / 100;
        return loan.amount + interest;
    }

    function distributeInterest() internal {
        uint256 platformFee = (accumulatedInterest * 10) / 100;
        uint256 lenderShare = accumulatedInterest - platformFee;

        lendingToken.transfer(owner(), platformFee);

        address[] memory lenders = getLenders();
        for (uint i = 0; i < lenders.length; ++i) {
            uint256 share = (lendingDeposits[lenders[i]] * lenderShare) / totalLendingDeposits;
            lendingToken.transfer(lenders[i], share);
        }

        accumulatedInterest = 0;
    }

    function getLenders() internal pure returns (address[] memory) {
        // This function should return the list of lenders
        // This is a placeholder implementation, it needs to be filled in with actual logic
        // One way to do this is to maintain an array of lenders in the contract and update it on deposits and withdrawals
        address[] memory lenders;
        return lenders;
    }

    function liquidate(address user, uint256 loanIndex) external onlyOwner {
        require(loanIndex < loans[user].length, "Invalid loan index");
        Loan storage loan = loans[user][loanIndex];
        require(loan.isActive, "No active loan");
        require(block.timestamp >= loan.duration, "Loan duration not yet passed");

        loan.isActive = false;
        totalLoans -= loan.amount;
        lendingToken.transfer(owner(), loan.amount);
        collateralToken.transfer(owner(), loan.collateralAmount);
        emit Liquidate(user);
    }

    function getLendingDepositBalance(address user) external view returns (uint256) {
        return lendingDeposits[user];
    }

    function getCollateralDepositBalance(address user) external view returns (uint256) {
        return collateralDeposits[user];
    }

    function getLoanDetails(address user, uint256 loanIndex) external view returns (uint256, uint256, uint256, uint256, bool) {
        require(loanIndex < loans[user].length, "Invalid loan index");
        Loan storage loan = loans[user][loanIndex];
        return (loan.amount, loan.interestRate, loan.duration, loan.collateralAmount, loan.isActive);
    }
}
