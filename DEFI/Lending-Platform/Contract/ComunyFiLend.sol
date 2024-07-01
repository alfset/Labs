// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IComunyFiLend {
    function setLiquidationThreshold(uint256 _threshold) external;
    function setLoanToValueRatio(uint256 _loanToValueRatio) external;
    function depositCollateral(address token, uint256 amount) external;
    function withdrawCollateral(address token, uint256 amount) external;
    function depositLender(address token, uint256 amount) external;
    function withdrawLender(address token, uint256 amount) external;
    function borrow(address token, uint256 amount) external;
    function repay(address token, uint256 amount) external;
    function setPoolOwner(address newOwner) external;
    function getTokenPair() external view returns (address tokenA, address tokenB);
    function poolOwner() external view returns (address);
    function distributeFees() external;
}

contract ComunyFiLend is ReentrancyGuard, IComunyFiLend, Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    struct Reserve {
        uint256 totalLiquidity;
        uint256 availableLiquidity;
        uint256 totalInterestCollected;
        mapping(address => uint256) depositedTokens;
        mapping(address => uint256) borrowedTokens;
    }

    mapping(address => Reserve) public reserves;
    address public tokenA;
    address public tokenB;
    address private _router;
    address private _owner;

    uint256 public interestRatePerYear = 5;
    uint256 public initialLTV;
    uint256 public initialThreshold; // 5% annual interest rate
    uint256 public constant YEAR_IN_SECONDS = 365 days;
    uint256 public ownerFeePercentage = 10; // 10% of the interest collected
    uint256 public loanToValueRatio = 80; // Initial loan-to-value ratio in percentage (80%)
    uint256 public liquidationThreshold = 20;

    event DepositCollateral(address indexed user, address indexed token, uint256 amount);
    event WithdrawCollateral(address indexed user, address indexed token, uint256 amount);
    event DepositLender(address indexed user, address indexed token, uint256 amount);
    event WithdrawLender(address indexed user, address indexed token, uint256 amount);
    event Borrow(address indexed user, address indexed token, uint256 amount);
    event Repay(address indexed user, address indexed token, uint256 amount);
    event LiquidationThresholdSet(uint256 threshold);
    event PoolOwnerSet(address indexed previousOwner, address indexed newOwner);
    event FeesDistributed(uint256 amount, address indexed to);

    modifier onlyRouterOrOwner() {
        require(msg.sender == _router || msg.sender == _owner, "Not authorized");
        _;
    }

    constructor(address _initialOwner, address _tokenA, address _tokenB, uint256 _initialLTV, uint256 _initialThreshold)
        Ownable(_initialOwner)
    {
        _owner = _initialOwner;
        tokenA = _tokenA;
        tokenB = _tokenB;
        initialLTV = _initialLTV;
        initialThreshold = _initialThreshold;
    }

    function setPoolOwner(address newOwner) external override onlyRouterOrOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        emit PoolOwnerSet(_owner, newOwner);
        _owner = newOwner;
    }

    function depositCollateral(address token, uint256 amount) external override nonReentrant {
        require(amount > 0, "Deposit amount must be greater than zero");
        require(token == tokenA || token == tokenB, "Invalid token");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        reserves[token].depositedTokens[msg.sender] += amount;
        reserves[token].totalLiquidity += amount;

        emit DepositCollateral(msg.sender, token, amount);
    }

    function withdrawCollateral(address token, uint256 amount) external override nonReentrant {
        require(reserves[token].depositedTokens[msg.sender] >= amount, "Insufficient deposit balance");
        require(token == tokenA || token == tokenB, "Invalid token");

        reserves[token].depositedTokens[msg.sender] -= amount;
        reserves[token].totalLiquidity -= amount;

        IERC20(token).safeTransfer(msg.sender, amount);

        emit WithdrawCollateral(msg.sender, token, amount);
    }

    function depositLender(address token, uint256 amount) external override nonReentrant {
        require(amount > 0, "Deposit amount must be greater than zero");
        require(token == tokenA || token == tokenB, "Invalid token");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        reserves[token].availableLiquidity += amount;
        reserves[token].totalLiquidity += amount;

        emit DepositLender(msg.sender, token, amount);
    }

    function withdrawLender(address token, uint256 amount) external override nonReentrant {
        require(reserves[token].availableLiquidity >= amount, "Insufficient liquidity");
        require(token == tokenA || token == tokenB, "Invalid token");

        reserves[token].availableLiquidity -= amount;
        reserves[token].totalLiquidity -= amount;

        IERC20(token).safeTransfer(msg.sender, amount);

        emit WithdrawLender(msg.sender, token, amount);
    }

    function borrow(address token, uint256 amount) external override nonReentrant {
        require(amount > 0, "Borrow amount must be greater than zero");
        require(token == tokenA || token == tokenB, "Invalid token");
        require(reserves[token].availableLiquidity >= amount, "Insufficient liquidity");

        uint256 collateral = reserves[tokenA].depositedTokens[msg.sender] + reserves[tokenB].depositedTokens[msg.sender];
        require(collateral > 0, "Collateral required");

        uint256 maxBorrowAmount = (collateral * loanToValueRatio) / 100;
        require(reserves[token].borrowedTokens[msg.sender] + amount <= maxBorrowAmount, "Loan-to-value ratio exceeded");

        reserves[token].borrowedTokens[msg.sender] += amount;
        reserves[token].availableLiquidity -= amount;

        IERC20(token).safeTransfer(msg.sender, amount);

        emit Borrow(msg.sender, token, amount);
    }

    function repay(address token, uint256 amount) external override nonReentrant {
        require(reserves[token].borrowedTokens[msg.sender] >= amount, "Insufficient borrowed amount");
        require(token == tokenA || token == tokenB, "Invalid token");

        reserves[token].borrowedTokens[msg.sender] -= amount;
        reserves[token].availableLiquidity += amount;

        uint256 interestAmount = (amount * interestRatePerYear * (block.timestamp - reserves[token].borrowedTokens[msg.sender])) / (100 * YEAR_IN_SECONDS);
        reserves[token].totalInterestCollected += interestAmount;

        uint256 ownerInterest = (interestAmount * ownerFeePercentage) / 100;
        uint256 poolInterest = interestAmount - ownerInterest;
        IERC20(token).safeTransfer(_owner, ownerInterest); // Transfer interest to owner
        reserves[token].availableLiquidity += poolInterest;

        emit Repay(msg.sender, token, amount);
    }

    function setInterestRate(uint256 _interestRatePerYear) external onlyRouterOrOwner {
        require(_interestRatePerYear > 0, "Interest rate must be greater than zero");
        interestRatePerYear = _interestRatePerYear;
    }

    function setOwnerFeePercentage(uint256 _ownerFeePercentage) external onlyRouterOrOwner {
        require(_ownerFeePercentage > 0 && _ownerFeePercentage <= 100, "Owner fee percentage must be between 0 and 100");
        ownerFeePercentage = _ownerFeePercentage;
    }

    function setLoanToValueRatio(uint256 _loanToValueRatio) public onlyRouterOrOwner {
        require(_loanToValueRatio > 0 && _loanToValueRatio <= 100, "Loan-to-value ratio must be between 0 and 100");
        loanToValueRatio = _loanToValueRatio;
    }

    function setLiquidationThreshold(uint256 _threshold) public onlyRouterOrOwner {
        require(_threshold > 0 && _threshold <= 100, "Liquidation threshold must be between 0 and 100");
        liquidationThreshold = _threshold;
        emit LiquidationThresholdSet(_threshold);
    }

    function getTokenPair() external view override returns (address, address) {
        return (tokenA, tokenB);
    }

    function poolOwner() external view override returns (address) {
        return _owner;
    }

    function distributeFees() external override onlyRouterOrOwner {
        for (uint i = 0; i < 2; i++) {
            address token = i == 0 ? tokenA : tokenB;
            uint256 interestCollected = reserves[token].totalInterestCollected;
            if (interestCollected > 0) {
                IERC20(token).safeTransfer(_owner, interestCollected);
                reserves[token].totalInterestCollected = 0;
                emit FeesDistributed(interestCollected, _owner);
            }
        }
    }
}
