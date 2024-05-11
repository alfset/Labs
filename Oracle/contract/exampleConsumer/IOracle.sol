// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOracle {
    function getPrice(bytes32 priceId) external payable returns (uint256);
    function requestRandomNumber() external returns (bytes32);
    function getPriceId(string calldata symbol) external returns (bytes32);
    function getRandomNumber(bytes32 requestId) external view returns (uint256);
}
