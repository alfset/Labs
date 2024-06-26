// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./LiquidityPool.sol";

contract LiquidityPoolFactory {
    address public oracle;
    event PoolCreated(address indexed tokenA, address indexed tokenB, address poolAddress);

    constructor(address _oracle) {
        oracle = _oracle;
    }

    function createPool(address tokenA, address tokenB, string memory symbolTokenA, string memory symbolTokenB) public returns (address) {
        LiquidityPool pool = new LiquidityPool(oracle, tokenA, tokenB, symbolTokenA, symbolTokenB);
        emit PoolCreated(tokenA, tokenB, address(pool));
        return address(pool);
    }
}
