// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IBCClient.sol";

contract ProofHandler {
    IBCClient public client;

    constructor(address _client) {
        client = IBCClient(_client);
    }

    function verifyProof(address clientId, bytes32 root, bytes memory proof, bytes32 leaf, uint256 index) external view returns (bool) {
        IBCClient.ClientState memory state = client.clientStates(clientId);
        bytes32 computedRoot = computeRoot(proof, leaf, index);
        return state.latestRoot == computedRoot;
    }

    function computeRoot(bytes memory proof, bytes32 leaf, uint256 index) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;
        uint256 proofLen = proof.length / 32;
        for (uint256 i = 0; i < proofLen; i++) {
            bytes32 proofElement;
            assembly {
                proofElement := mload(add(proof, add(32, mul(i, 32))))
            }
            if (index % 2 == 0) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
            index = index / 2;
        }
        return computedHash;
    }
}
