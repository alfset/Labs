// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOracle {
    function getPrice(bytes32 priceId) external payable returns (uint256);
    function requestRandomNumber() external returns (bytes32);
    function getPriceId(string calldata symbol) external returns (bytes32);
    function getRandomNumber(bytes32 requestId) external view returns (uint256);
}

contract Consumer {
    IOracle public oracle;
    mapping(bytes32 => bool) public randomNumberAvailable;
    mapping(bytes32 => uint256) public randomNumbers;
    mapping(string => bytes32) public priceIds;

    event ReceivedPrice(string symbol, bytes32 priceId, uint256 price);
    event ReceivedRandomNumber(uint256 randomNumber);

    constructor(address oracleAddress) {
        oracle = IOracle(oracleAddress);
    }


    // Function to retrieve the price for a given symbol
    function retrievePrice(string calldata symbol) public payable returns (bytes32 priceId, uint256 price) {
        priceId = oracle.getPriceId(symbol); // Retrieve priceId based on the symbol directly from the Oracle
        price = oracle.getPrice{value: msg.value}(priceId); // Retrieve the price using the priceId
        emit ReceivedPrice(symbol, priceId, price);
        return (priceId, price); // Return both the priceId and the price
    }

    // Function to request a random number
    function getRandomNumber() public {
        bytes32 requestId = oracle.requestRandomNumber();
        randomNumberAvailable[requestId] = false; // mark it as not available initially
    }

    // Function to retrieve a random number after it has been set
    function retrieveRandomNumber(bytes32 requestId) public {
        require(randomNumberAvailable[requestId], "Random number not available yet");
        uint256 randomNumber = oracle.getRandomNumber(requestId);
        randomNumbers[requestId] = randomNumber;
        randomNumberAvailable[requestId] = true; // mark it as available
        emit ReceivedRandomNumber(randomNumber);
    }
}
