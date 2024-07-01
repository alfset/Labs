// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./ComunyFiProxy.sol";
import "./ComunyFiLend.sol";

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
    event PoolOwnerSet(address indexed pair, address indexed previousOwner, address indexed newOwner);
    event InterestFeeDistributed(address indexed lendingPool, address indexed token, uint256 totalInterest, uint256 routerFee, uint256 lenderFee);

    uint256 public constant FEE_PERCENT = 10; // 10% interest fee to router owner

    constructor(address initialOwner) Ownable(initialOwner) {
        // Initialize contract with an initial owner
    }

    modifier onlyRouter() {
        require(msg.sender == address(this), "Only router can call this function");
        _;
    }

    function createPair(address tokenA, address tokenB, uint256 initialLTV, uint256 initialThreshold) external onlyOwner returns (address) {
        require(tokenA != tokenB, "Identical tokens");
        require(pairToLendingPool[tokenA][tokenB] == address(0), "Pair already exists");
        require(supportedTokens.contains(tokenA) && supportedTokens.contains(tokenB), "Tokens not supported");

        address lendingPool = address(new ComunyFiLendProxy(address(new ComunyFiLend(msg.sender, tokenA, tokenB, initialLTV, initialThreshold)), "")); 

        pairToLendingPool[tokenA][tokenB] = lendingPool;
        pairToLendingPool[tokenB][tokenA] = lendingPool;

        pairs.add(lendingPool);

        emit PairCreated(tokenA, tokenB, lendingPool);

        return lendingPool;
    }

    function getPairToken(address tokenA, address tokenB) external view returns (address, address) {
        address lendingPool = pairToLendingPool[tokenA][tokenB];
        require(lendingPool != address(0), "Pair does not exist");
        return ComunyFiLend(lendingPool).getTokenPair();
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

    function depositLender(address token, uint256 amount) external {
        require(supportedTokens.contains(token), "Token not supported");
        address lendingPool = pairToLendingPool[token][address(0)];
        require(lendingPool != address(0), "Lending pool not found");
        IERC20(token).safeTransferFrom(msg.sender, lendingPool, amount);
        ComunyFiLend(lendingPool).depositLender(token, amount);
    }

    function depositCollateral(address token, uint256 amount) external {
        require(supportedTokens.contains(token), "Token not supported");
        address lendingPool = pairToLendingPool[token][address(0)];
        require(lendingPool != address(0), "Lending pool not found");
        IERC20(token).safeTransferFrom(msg.sender, lendingPool, amount);
        ComunyFiLend(lendingPool).depositCollateral(token, amount);
    }

    function withdrawLender(address token, uint256 amount) external {
        require(supportedTokens.contains(token), "Token not supported");
        address lendingPool = pairToLendingPool[token][address(0)];
        require(lendingPool != address(0), "Lending pool not found");
        ComunyFiLend(lendingPool).withdrawLender(token, amount);
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    function withdrawCollateral(address token, uint256 amount) external {
        require(supportedTokens.contains(token), "Token not supported");
        address lendingPool = pairToLendingPool[token][address(0)];
        require(lendingPool != address(0), "Lending pool not found");
        ComunyFiLend(lendingPool).withdrawCollateral(token, amount);
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    function borrow(address token, uint256 amount) external {
        require(supportedTokens.contains(token), "Token not supported");
        address lendingPool = pairToLendingPool[token][address(0)];
        require(lendingPool != address(0), "Lending pool not found");
        ComunyFiLend(lendingPool).borrow(token, amount);
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    function repay(address token, uint256 amount) external {
        require(supportedTokens.contains(token), "Token not supported");
        address lendingPool = pairToLendingPool[token][address(0)];
        require(lendingPool != address(0), "Lending pool not found");
        IERC20(token).safeTransferFrom(msg.sender, lendingPool, amount);
        ComunyFiLend(lendingPool).repay(token, amount);
    }

    function setPoolOwner(address tokenA, address tokenB, address _newOwner) external onlyOwner {
        address lendingPool = pairToLendingPool[tokenA][tokenB];
        require(lendingPool != address(0), "Pair does not exist");
        ComunyFiLend(lendingPool).setPoolOwner(_newOwner);
        emit PoolOwnerSet(lendingPool, ComunyFiLend(lendingPool).poolOwner(), _newOwner);
    }

    function distributeInterestFee(address lendingPool, address token, uint256 totalInterest) external onlyRouter {
    require(lendingPool != address(0), "Invalid lending pool address");

    uint256 routerFee = (totalInterest * FEE_PERCENT) / 100;
    uint256 lenderFee = totalInterest - routerFee;

    IERC20(token).safeTransfer(owner(), routerFee);
    ComunyFiLend(lendingPool).distributeFees(); // Ensure `distributeFees()` in ComunyFiLend matches the expected parameters

    emit InterestFeeDistributed(lendingPool, token, totalInterest, routerFee, lenderFee);
}
}
