// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IBCConnection {
    struct ConnectionEnd {
        bytes32 clientId;
        bytes32[] versions;
        uint64 state;
    }

    mapping(bytes32 => ConnectionEnd) public connections;

    event ConnectionOpened(bytes32 indexed connectionId, bytes32 clientId, bytes32[] versions, uint64 state);

    function openConnection(bytes32 connectionId, bytes32 clientId, bytes32[] memory versions, uint64 state) external {
        connections[connectionId] = ConnectionEnd(clientId, versions, state);
        emit ConnectionOpened(connectionId, clientId, versions, state);
    }

    function getConnection(bytes32 connectionId) external view returns (ConnectionEnd memory) {
        return connections[connectionId];
    }
}
