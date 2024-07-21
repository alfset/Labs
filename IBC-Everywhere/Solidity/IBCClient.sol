// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IBCClient {
    struct ClientState {
        address clientId;
        bytes32 latestRoot;
        uint64 latestHeight;
    }

    mapping(address => ClientState) public clientStates;

    event ClientStateUpdated(address indexed clientId, bytes32 latestRoot, uint64 latestHeight);

    function updateClientState(address clientId, bytes32 latestRoot, uint64 latestHeight) external {
        clientStates[clientId] = ClientState(clientId, latestRoot, latestHeight);
        emit ClientStateUpdated(clientId, latestRoot, latestHeight);
    }

    function getClientState(address clientId) external view returns (ClientState memory) {
        return clientStates[clientId];
    }
}
