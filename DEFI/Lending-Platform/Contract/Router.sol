// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Ownable.sol";
import "./LendingPool.sol";

contract LendingRouter is Ownable {
    struct TokenPair {
        address lendingToken;
        address collateralToken;
    }

    mapping(address => mapping(address => address)) public lendingPools;
    mapping(address => bool) public allowedLendingTokens;
    mapping(address => bool) public allowedCollateralTokens;

    event LendingPoolCreated(address indexed lendingToken, address indexed collateralToken, address pool);

    function addAllowedLendingToken(address token) external onlyOwner {
        allowedLendingTokens[token] = true;
    }

    function removeAllowedLendingToken(address token) external onlyOwner {
        allowedLendingTokens[token] = false;
    }

    function addAllowedCollateralToken(address token) external onlyOwner {
        allowedCollateralTokens[token] = true;
    }

    function removeAllowedCollateralToken(address token) external onlyOwner {
        allowedCollateralTokens[token] = false;
    }

    function createLendingPool(address lendingToken, address collateralToken) external onlyOwner {
        require(allowedLendingTokens[lendingToken], "Lending token not allowed");
        require(allowedCollateralTokens[collateralToken], "Collateral token not allowed");

        LendingPool pool = new LendingPool(lendingToken, collateralToken);
        lendingPools[lendingToken][collateralToken] = address(pool);

        emit LendingPoolCreated(lendingToken, collateralToken, address(pool));
    }

    function getLendingPool(address lendingToken, address collateralToken) external view returns (address) {
        return lendingPools[lendingToken][collateralToken];
    }
}
