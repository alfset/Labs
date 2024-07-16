// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IBCClient.sol";
import "./IBCConnection.sol";
import "./IBCChannel.sol";
import "./ProofHandler.sol";

contract IBCTransfer {
    IBCClient public client;
    IBCConnection public connection;
    IBCChannel public channel;
    ProofHandler public proofHandler;

    struct Transfer {
        address sender;
        address receiver;
        uint256 amount;
        bytes32 channelId;
        bool completed;
    }

    mapping(bytes32 => Transfer) public transfers;
    mapping(address => uint256) public balances;

    event TransferInitiated(bytes32 transferId, address indexed sender, address indexed receiver, uint256 amount, bytes32 channelId);
    event TransferCompleted(bytes32 transferId, address indexed receiver, uint256 amount, bytes32 channelId);

    constructor(address _client, address _connection, address _channel, address _proofHandler) {
        client = IBCClient(_client);
        connection = IBCConnection(_connection);
        channel = IBCChannel(_channel);
        proofHandler = ProofHandler(_proofHandler);
    }

    function initiateTransfer(address receiver, uint256 amount, bytes32 channelId) external {
        bytes32 transferId = keccak256(abi.encodePacked(msg.sender, receiver, amount, channelId, block.timestamp));
        transfers[transferId] = Transfer(msg.sender, receiver, amount, channelId, false);
        emit TransferInitiated(transferId, msg.sender, receiver, amount, channelId);
    }

    function completeTransfer(bytes32 transferId, bytes32 root, bytes memory proof, bytes32 leaf, uint256 index) external {
        Transfer storage transfer = transfers[transferId];

        require(!transfer.completed, "Transfer already completed");
        require(proofHandler.verifyProof(msg.sender, root, proof, leaf, index), "Invalid proof");

        transfer.completed = true;
        balances[transfer.receiver] += transfer.amount;

        emit TransferCompleted(transferId, transfer.receiver, transfer.amount, transfer.channelId);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    receive() external payable {}
}
