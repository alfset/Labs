// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Ownable.sol";

contract LendingPool is Ownable {
    ERC20 public lendingToken;
    ERC20 public collateralToken;
    uint256 public totalDeposits;
    uint256 public totalLoans;

    struct Loan {
        uint256 amount;
        uint256 interestRate;
        uint256 duration;
        uint256 collateralAmount;
        bool isActive;
    }

    mapping(address => uint256) public deposits;
    mapping(address => Loan) public loans;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Borrow(address indexed user, uint256 amount, uint256 collateralAmount);
    event Repay(address indexed user, uint256 amount);
    event Liquidate(address indexed user);

    constructor(address _lendingToken, address _collateralToken) {
        lendingToken = ERC20(_lendingToken);
        collateralToken = ERC20(_collateralToken);
    }

    function deposit(uint256 amount) external {
        lendingToken.transferFrom(msg.sender, address(this), amount);
        deposits[msg.sender] += amount;
        totalDeposits += amount;
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        deposits[msg.sender] -= amount;
        totalDeposits -= amount;
        lendingToken.transfer(msg.sender, amount);
        emit Withdraw(msg.sender, amount);
    }

    function borrow(uint256 amount, uint256 interestRate, uint256 duration) external {
        uint256 collateralAmount = amount; // 1:1 collateral ratio
        require(collateralToken.balanceOf(msg.sender) >= collateralAmount, "Insufficient collateral");
        collateralToken.transferFrom(msg.sender, address(this), collateralAmount);

        loans[msg.sender] = Loan(amount, interestRate, duration, collateralAmount, true);
        totalLoans += amount;
        lendingToken.transfer(msg.sender, amount);
        emit Borrow(msg.sender, amount, collateralAmount);
    }

    function repay(uint256 amount) external {
        Loan storage loan = loans[msg.sender];
        require(loan.isActive, "No active loan");
        require(amount >= loan.amount, "Repay full amount");

        loan.isActive = false;
        totalLoans -= loan.amount;
        lendingToken.transferFrom(msg.sender, address(this), amount);
        collateralToken.transfer(msg.sender, loan.collateralAmount);
        emit Repay(msg.sender, amount);
    }

    function liquidate(address user) external onlyOwner {
        Loan storage loan = loans[user];
        require(loan.isActive, "No active loan");
        require(block.timestamp >= loan.duration, "Loan duration not yet passed");

        loan.isActive = false;
        totalLoans -= loan.amount;
        lendingToken.transfer(owner(), loan.amount);
        collateralToken.transfer(owner(), loan.collateralAmount);
        emit Liquidate(user);
    }
}
