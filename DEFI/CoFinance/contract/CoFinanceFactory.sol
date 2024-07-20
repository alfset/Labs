// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ibc.sol"; 

contract CoFinanceFactory {
    address public owner;
    address[] public allPools; 
    mapping(address => mapping(address => address)) public pools; 
    mapping(address => address[]) public poolsByToken;
    mapping(address => address) public poolByPair; 
    event PoolCreated(
        address indexed poolAddress,
        address indexed tokenA,
        address indexed tokenB,
        address liquidityTokenAddress,
        address rewardToken,
        address priceFeed,
        address stakingContract,
        bool isPoolIncentivized
    );

    constructor() {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    function createPool(
        address tokenA,
        address tokenB,
        address rewardToken,
        address priceFeed,
        string memory liquidityTokenName,
        string memory liquidityTokenSymbol,
        address stakingContract,
        bool isPoolIncentivized
    ) external onlyOwner returns (address) {
        require(tokenA != tokenB, "Token addresses must be different");
        if (tokenA > tokenB) {
            (tokenA, tokenB) = (tokenB, tokenA);
        }
        address existingPool = pools[tokenA][tokenB];
        if (existingPool != address(0)) {
            return existingPool; 
        }
        LiquidityToken liquidityToken = new LiquidityToken(liquidityTokenName, liquidityTokenSymbol);
        CoFinance pool = new CoFinance(
            tokenA,
            tokenB,
            rewardToken,
            priceFeed,
            address(liquidityToken),
            stakingContract,
            isPoolIncentivized
        );
        liquidityToken.setCoFinanceContract(address(pool));
        pools[tokenA][tokenB] = address(pool);
        poolsByToken[tokenA].push(address(pool));
        poolsByToken[tokenB].push(address(pool));
        allPools.push(address(pool));

        emit PoolCreated(
            address(pool),
            tokenA,
            tokenB,
            address(liquidityToken),
            rewardToken,
            priceFeed,
            stakingContract,
            isPoolIncentivized
        );
        return address(pool);
    }
    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }
    function getPoolByToken(address token) external view returns (address[] memory) {
        return poolsByToken[token];
    }
    function getPoolByPair(address tokenA, address tokenB) external view returns (address) {
        if (tokenA > tokenB) {
            (tokenA, tokenB) = (tokenB, tokenA);
        }
        return pools[tokenA][tokenB];
    }
}
