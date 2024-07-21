// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IBCConnection.sol";

contract IBCChannel {
    IBCConnection public connection;

    struct ChannelEnd {
        bytes32 connectionId;
        string portId;
        string counterpartyPortId;
    }

    mapping(bytes32 => ChannelEnd) public channels;

    event ChannelOpened(bytes32 indexed channelId, bytes32 connectionId, string portId, string counterpartyPortId);

    constructor(address _connection) {
        connection = IBCConnection(_connection);
    }

    function openChannel(bytes32 channelId, bytes32 connectionId, string memory portId, string memory counterpartyPortId) external {
        channels[channelId] = ChannelEnd(connectionId, portId, counterpartyPortId);
        emit ChannelOpened(channelId, connectionId, portId, counterpartyPortId);
    }

    function getChannel(bytes32 channelId) external view returns (ChannelEnd memory) {
        return channels[channelId];
    }
}
