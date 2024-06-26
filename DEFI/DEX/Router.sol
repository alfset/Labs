// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LiquidityPool.sol";
import "./IOracle.sol";
import "./IERC20.sol";

contract Router {
    IOracle public oracle;

    constructor(address _oracleAddress) {
        oracle = IOracle(_oracleAddress);
    }

    function swap(address poolAddress, uint256 amount, bool isBuy) public {
        LiquidityPool pool = LiquidityPool(poolAddress);
        string memory symbol = isBuy ? pool.symbolTokenB() : pool.symbolTokenA();
        uint256 price = oracle.getPrice(oracle.getPriceId(symbol));

        if (isBuy) {
            require(IERC20(pool.tokenA()).transferFrom(msg.sender, poolAddress, amount), "Transfer failed");
            pool.swapTokenAForTokenB(amount);
        } else {
            require(IERC20(pool.tokenB()).transferFrom(msg.sender, poolAddress, amount), "Transfer failed");
            pool.swapTokenBForTokenA(amount);
        }
    }

    function addLiquidity(address poolAddress, uint256 tokenAAmount, uint256 tokenBAmount) public {
        LiquidityPool pool = LiquidityPool(poolAddress);
        require(IERC20(pool.tokenA()).transferFrom(msg.sender, poolAddress, tokenAAmount), "Transfer of token A failed");
        require(IERC20(pool.tokenB()).transferFrom(msg.sender, poolAddress, tokenBAmount), "Transfer of token B failed");
        pool.addLiquidity(tokenAAmount, tokenBAmount);
    }

    function removeLiquidity(address poolAddress, uint256 liquidityAmount) public {
        LiquidityPool pool = LiquidityPool(poolAddress);
        pool.removeLiquidity(liquidityAmount);
        IERC20(pool.tokenA()).transfer(msg.sender, liquidityAmount / 2);
        IERC20(pool.tokenB()).transfer(msg.sender, liquidityAmount / 2);
    }
}
