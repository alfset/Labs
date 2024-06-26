// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";
import "./IOracle.sol";  

contract LiquidityPool {
    IOracle public oracle;
    IERC20 public tokenA;
    IERC20 public tokenB;
    string public symbolTokenA;
    string public symbolTokenB;

    mapping(address => uint256) public liquidity;
    mapping(string => uint256) public lastKnownPrice;

    event ReceivedPrice(string symbol, uint256 price);
    event PriceUpdated(string symbol, uint256 price);

    constructor(address _oracle, address _tokenA, address _tokenB, string memory _symbolTokenA, string memory _symbolTokenB) {
        oracle = IOracle(_oracle);
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        symbolTokenA = _symbolTokenA;
        symbolTokenB = _symbolTokenB;
    }

    function addLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) external {
        tokenA.transferFrom(msg.sender, address(this), tokenAAmount);
        tokenB.transferFrom(msg.sender, address(this), tokenBAmount);
        liquidity[msg.sender] += tokenAAmount + tokenBAmount;
    }

    function removeLiquidity(uint256 amount) external {
        require(liquidity[msg.sender] >= amount, "Not enough liquidity");
        tokenA.transfer(msg.sender, amount / 2);
        tokenB.transfer(msg.sender, amount / 2);
        liquidity[msg.sender] -= amount;
    }

    function swapTokenAForTokenB(uint256 tokenAAmount) external {
        uint256 tokenAPrice = lastKnownPrice[symbolTokenA];
        uint256 tokenBPrice = lastKnownPrice[symbolTokenB];
        uint256 tokenBAmount = (tokenAAmount * tokenAPrice) / tokenBPrice;

        require(tokenB.balanceOf(address(this)) >= tokenBAmount, "Insufficient token B balance");
        tokenA.transferFrom(msg.sender, address(this), tokenAAmount);
        tokenB.transfer(msg.sender, tokenBAmount);
    }

    function swapTokenBForTokenA(uint256 tokenBAmount) external {
        uint256 tokenAPrice = lastKnownPrice[symbolTokenA];
        uint256 tokenBPrice = lastKnownPrice[symbolTokenB];
        uint256 tokenAAmount = (tokenBAmount * tokenBPrice) / tokenAPrice;

        require(tokenA.balanceOf(address(this)) >= tokenAAmount, "Insufficient token A balance");
        tokenB.transferFrom(msg.sender, address(this), tokenBAmount);
        tokenA.transfer(msg.sender, tokenAAmount);
    }

    // Function to retrieve and update the price for a given symbol
    function updatePrice(string memory symbol) public payable {
        bytes32 priceId = oracle.getPriceId(symbol);
        uint256 price = oracle.getPrice{value: msg.value}(priceId);
        lastKnownPrice[symbol] = price;
        emit PriceUpdated(symbol, price);
    }
}
