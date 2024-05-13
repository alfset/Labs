// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract IBCEthereumBridge {
    IERC20 public token;
    event Locked(address indexed sender, uint256 amount, string destination);
    event Unlocked(address indexed recipient, uint256 amount);

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function lockTokens(uint256 _amount, string memory _destination) public {
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        emit Locked(msg.sender, _amount, _destination);
    }

    function unlockTokens(address _recipient, uint256 _amount) public {
          //todo add validation logic
        require(token.transfer(_recipient, _amount), "Transfer failed");
        emit Unlocked(_recipient, _amount);
    }
}
