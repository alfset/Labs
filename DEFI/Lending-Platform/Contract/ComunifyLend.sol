// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./Ownable.sol";

interface IComunyFiLend {
    function setLiquidationThreshold(uint256 _threshold) external;
    function setLoanToValueRatio(uint256 _loanToValueRatio) external;
    function deposit(address token, uint256 amount) external;
    function withdraw(address token, uint256 amount) external;
    function borrow(address token, uint256 amount) external;
    function repay(address token, uint256 amount) external;
    function setPoolOwner(address _newOwner) external;
    function getTokenPair() external view returns (address tokenA, address tokenB);
}

contract ComunyFiLend is ReentrancyGuard, IComunyFiLend {
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.AddressSet;

    struct Reserve {
        uint256 totalLiquidity;
        uint256 availableLiquidity;
        uint256 totalInterestCollected;
        mapping(address => uint256) depositedTokens;
        mapping(address => uint256) borrowedTokens;
        mapping(address => mapping(address => uint256)) borrowerAllowances;
    }

    mapping(address => Reserve) public reserves;
    address public tokenA;
    address public tokenB;

    uint256 public interestRatePerYear = 5; // 5% annual interest rate
    uint256 public constant YEAR_IN_SECONDS = 365 days;
    uint256 public ownerFeePercentage = 10; // 10% of the interest collected
    uint256 public loanToValueRatio = 80; // Initial loan-to-value ratio in percentage (50%)
    uint256 public liquidationThreshold = 20;
    address public router;

    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    event Borrow(address indexed user, address indexed token, uint256 amount);
    event Repay(address indexed user, address indexed token, uint256 amount);
    event LiquidationThresholdSet(uint256 threshold);

    constructor(address _router, address _tokenA, address _tokenB) {
        router = _router;
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function setPoolOwner(address _newOwner) public override {
        require(msg.sender == router, "Only router can set the pool owner");
        router = _newOwner;
    }

    function deposit(address token, uint256 amount) external override nonReentrant {
        require(amount > 0, "Deposit amount must be greater than zero");
        require(token == tokenA || token == tokenB, "Invalid token");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        reserves[token].depositedTokens[msg.sender] += amount;
        reserves[token].totalLiquidity += amount;
        reserves[token].availableLiquidity += amount;

        emit Deposit(msg.sender, token, amount);
    }

    function liquidateThreshold(address token, address borrower) external {
        require(msg.sender == router, "Only router can perform liquidation");

        uint256 maxBorrowAmount = (reserves[token].totalLiquidity * loanToValueRatio) / 100;
        uint256 borrowerBorrowedAmount = reserves[token].borrowedTokens[borrower];

        require(borrowerBorrowedAmount > 0, "Borrower has no debt");

        uint256 currentLTV = (borrowerBorrowedAmount * 100) / reserves[token].totalLiquidity;
        require(currentLTV >= liquidationThreshold, "Current LTV is below liquidation threshold");

        reserves[token].borrowedTokens[borrower] = 0;
        reserves[token].availableLiquidity += borrowerBorrowedAmount;

        emit Repay(borrower, token, borrowerBorrowedAmount);
    }

    function withdraw(address token, uint256 amount) external override nonReentrant {
        require(reserves[token].depositedTokens[msg.sender] >= amount, "Insufficient deposit balance");
        require(token == tokenA || token == tokenB, "Invalid token");

        reserves[token].depositedTokens[msg.sender] -= amount;
        reserves[token].totalLiquidity -= amount;
        reserves[token].availableLiquidity -= amount;

        IERC20(token).safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, token, amount);
    }

    function borrow(address token, uint256 amount) external override nonReentrant {
        require(amount > 0, "Borrow amount must be greater than zero");
        require(token == tokenA || token == tokenB, "Invalid token");
        require(reserves[token].availableLiquidity >= amount, "Insufficient liquidity");

        uint256 maxBorrowAmount = (reserves[token].totalLiquidity * loanToValueRatio) / 100;
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

        uint256 interestAmount = (amount * interestRatePerYear * (block.timestamp - reserves[token].borrowerAllowances[msg.sender][token])) / (100 * YEAR_IN_SECONDS);
        reserves[token].totalInterestCollected += interestAmount;

        uint256 ownerInterest = (interestAmount * ownerFeePercentage) / 100;
        uint256 poolInterest = interestAmount - ownerInterest;
        IERC20(token).safeTransfer(router, ownerInterest); // Transfer interest to router
        reserves[token].availableLiquidity += poolInterest;

        emit Repay(msg.sender, token, amount);
    }

    function setInterestRate(uint256 _interestRatePerYear) external {
        require(msg.sender == router, "Only router can set interest rate");
        require(_interestRatePerYear > 0, "Interest rate must be greater than zero");
        interestRatePerYear = _interestRatePerYear;
    }

    function setOwnerFeePercentage(uint256 _ownerFeePercentage) external {
        require(msg.sender == router, "Only router can set owner fee percentage");
        require(_ownerFeePercentage > 0 && _ownerFeePercentage <= 100, "Owner fee percentage must be between 0 and 100");
        ownerFeePercentage = _ownerFeePercentage;
    }

    function setLoanToValueRatio(uint256 _loanToValueRatio) public override {
        require(_loanToValueRatio > 0 && _loanToValueRatio <= 100, "Loan-to-value ratio must be between 0 and 100");
        loanToValueRatio = _loanToValueRatio;
    }

    function setLiquidationThreshold(uint256 _threshold) public override {
        require(_threshold > 0 && _threshold <= 100, "Liquidation threshold must be between 0 and 100");
        liquidationThreshold = _threshold;
        emit LiquidationThresholdSet(_threshold);
    }

    function getTokenPair() external view override returns (address, address) {
        return (tokenA, tokenB);
    }
}







contract ComunyFiRouter is Ownable {
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet private pairs;
    mapping(address => mapping(address => address)) public pairToLendingPool;
    EnumerableSet.AddressSet private supportedTokens;

    event PairCreated(address indexed tokenA, address indexed tokenB, address indexed lendingPool);
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event PoolRemoved(address indexed lendingPool);

    function createPair(address tokenA, address tokenB, uint256 initialLTV, uint256 initialThreshold) external returns (address) {
        require(tokenA != tokenB, "Identical tokens");
        require(pairToLendingPool[tokenA][tokenB] == address(0), "Pair already exists");

        address lendingPool = address(new ComunyFiLend(address(this), tokenA, tokenB)); // Deploy ComunyFiLend with this router as the router
        pairToLendingPool[tokenA][tokenB] = lendingPool;
        pairToLendingPool[tokenB][tokenA] = lendingPool;

        // Set the pool owner to the user who created the pair
        IComunyFiLend(lendingPool).setPoolOwner(msg.sender);

        // Set initial LTV and liquidation threshold
        IComunyFiLend(lendingPool).setLoanToValueRatio(initialLTV);
        IComunyFiLend(lendingPool).setLiquidationThreshold(initialThreshold);

        pairs.add(lendingPool);

        emit PairCreated(tokenA, tokenB, lendingPool);

        return lendingPool;
    }

     function getPairToken(address tokenA, address tokenB) external view returns (address, address) {
        address lendingPool = pairToLendingPool[tokenA][tokenB];
        require(lendingPool != address(0), "Pair does not exist");
        return IComunyFiLend(lendingPool).getTokenPair();
    }


    function removePair(address tokenA, address tokenB) external onlyOwner {
        address lendingPool = pairToLendingPool[tokenA][tokenB];
        require(lendingPool != address(0), "Pair does not exist");

        pairs.remove(lendingPool);
        delete pairToLendingPool[tokenA][tokenB];
        delete pairToLendingPool[tokenB][tokenA];

        emit PoolRemoved(lendingPool);
    }

    function isPair(address tokenA, address tokenB) external view returns (bool) {
        return pairToLendingPool[tokenA][tokenB] != address(0);
    }

    function getPairsCount() external view returns (uint256) {
        return pairs.length();
    }

    function getPairAtIndex(uint256 index) external view returns (address) {
        require(index < pairs.length(), "Index out of bounds");
        return pairs.at(index);
    }

    function addSupportedToken(address token) external onlyOwner {
        require(!supportedTokens.contains(token), "Token already supported");
        supportedTokens.add(token);
        emit TokenAdded(token);
    }

    function removeSupportedToken(address token) external onlyOwner {
        require(supportedTokens.contains(token), "Token not supported");
        supportedTokens.remove(token);
        emit TokenRemoved(token);
    }

    function isTokenSupported(address token) external view returns (bool) {
        return supportedTokens.contains(token);
    }

    function deposit(address token, uint256 amount) external {
        require(supportedTokens.contains(token), "Token not supported");
        IERC20(token).safeTransferFrom(msg.sender, pairToLendingPool[token][address(0)], amount);
        IComunyFiLend(pairToLendingPool[token][address(0)]).deposit(token, amount);
    }

    function withdraw(address token, uint256 amount) external {
        require(supportedTokens.contains(token), "Token not supported");
        IComunyFiLend(pairToLendingPool[token][address(0)]).withdraw(token, amount);
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    function borrow(address token, uint256 amount) external {
        require(supportedTokens.contains(token), "Token not supported");
        IComunyFiLend(pairToLendingPool[token][address(0)]).borrow(token, amount);
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    function repay(address token, uint256 amount) external {
        require(supportedTokens.contains(token), "Token not supported");
        IERC20(token).safeTransferFrom(msg.sender, pairToLendingPool[token][address(0)], amount);
        IComunyFiLend(pairToLendingPool[token][address(0)]).repay(token, amount);
    }
}
