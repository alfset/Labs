// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ComunyFiLend.sol";
import "./IERC20.sol";

contract ComunyFiRouter {
    LendingPool[] public pools;
    mapping(address => bool) public isLenderToken;
    mapping(address => bool) public isCollateralToken;
    mapping(address => mapping(address => bool)) public tokenApproved;

    event PoolCreated(address indexed lenderToken, address indexed collateralToken, address indexed poolAddress);
    event TVLSet(uint256 indexed poolIndex, address indexed tokenAddress, uint256 newTVL);
    event InterestRateSet(uint256 indexed poolIndex, address indexed tokenAddress, uint256 newInterestRate);
    event LiquidationThresholdSet(uint256 indexed poolIndex, uint256 newThreshold);

    modifier onlyApprovedToken(address tokenAddress) {
        require(tokenApproved[tokenAddress][msg.sender], "Token not approved");
        _;
    }

    function createPool(address lenderToken, address collateralToken) external onlyApprovedToken(lenderToken) onlyApprovedToken(collateralToken) {
        LendingPool newPool = new LendingPool();
        newPool.initializeTokens(lenderToken, collateralToken);

        if (!isLenderToken[lenderToken]) {
            isLenderToken[lenderToken] = true;
        }
        if (!isCollateralToken[collateralToken]) {
            isCollateralToken[collateralToken] = true;
        }

        pools.push(newPool);

        emit PoolCreated(lenderToken, collateralToken, address(newPool));
    }

    function approveToken(address tokenAddress) external {
        tokenApproved[tokenAddress][msg.sender] = true;
    }

    function revokeApproval(address tokenAddress) external {
        tokenApproved[tokenAddress][msg.sender] = false;
    }

    function isTokenApproved(address tokenAddress) external view returns (bool) {
        return tokenApproved[tokenAddress][msg.sender];
    }

    function getPoolCount() external view returns (uint256) {
        return pools.length;
    }

    function lendToPool(uint256 poolIndex, address tokenAddress, uint256 amount) external {
        require(poolIndex < pools.length, "Invalid pool index");

        LendingPool pool = pools[poolIndex];
        pool.lend(tokenAddress, amount);
    }

    function borrowFromPool(uint256 poolIndex, uint256 amount, address tokenAddress) external {
        require(poolIndex < pools.length, "Invalid pool index");

        LendingPool pool = pools[poolIndex];
        pool.borrow(amount, tokenAddress);
    }

    function withdrawFromPool(uint256 poolIndex, address tokenAddress, uint256 amount) external {
        require(poolIndex < pools.length, "Invalid pool index");

        LendingPool pool = pools[poolIndex];
        pool.withdraw(tokenAddress, amount);
    }

    function payDebtToPool(uint256 poolIndex, address tokenAddress, uint256 amount) external {
        require(poolIndex < pools.length, "Invalid pool index");

        LendingPool pool = pools[poolIndex];
        pool.payDebt(tokenAddress, amount);
    }

    function accrueInterest(uint256 poolIndex, address tokenAddress, uint256 amount) external {
        require(poolIndex < pools.length, "Invalid pool index");

        LendingPool pool = pools[poolIndex];
        pool.accrueInterest(tokenAddress, amount);
    }

    function collectFee(uint256 poolIndex, address tokenAddress, uint256 amount) external {
        require(poolIndex < pools.length, "Invalid pool index");

        LendingPool pool = pools[poolIndex];
        pool.collectFee(tokenAddress, amount);
    }

    function distributeInterest(uint256 poolIndex, address tokenAddress) external {
        require(poolIndex < pools.length, "Invalid pool index");

        LendingPool pool = pools[poolIndex];
        pool.distributeInterest(tokenAddress);
    }

    function liquidate(uint256 poolIndex, address tokenAddress, address lender) external {
        require(poolIndex < pools.length, "Invalid pool index");

        LendingPool pool = pools[poolIndex];
        pool.liquidate(tokenAddress, lender);
    }

    function setLiquidationThreshold(uint256 poolIndex, uint256 threshold) external {
        require(poolIndex < pools.length, "Invalid pool index");

        LendingPool pool = pools[poolIndex];
        pool.setLiquidationThreshold(threshold);

        emit LiquidationThresholdSet(poolIndex, threshold);
    }

    function setPoolTVL(uint256 poolIndex, address tokenAddress, uint256 newTVL) external {
        require(poolIndex < pools.length, "Invalid pool index");

        LendingPool pool = pools[poolIndex];
        pool.setTotalValueLocked(tokenAddress, newTVL);

        emit TVLSet(poolIndex, tokenAddress, newTVL);
    }

    function setPoolInterestRate(uint256 poolIndex, address tokenAddress, uint256 newInterestRate) external {
        require(poolIndex < pools.length, "Invalid pool index");

        LendingPool pool = pools[poolIndex];
        pool.setInterestRate(tokenAddress, newInterestRate);

        emit InterestRateSet(poolIndex, tokenAddress, newInterestRate);
    }
}
