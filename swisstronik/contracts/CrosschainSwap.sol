// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IMailbox } from "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import { IPostDispatchHook } from "@hyperlane-xyz/core/contracts/interfaces/hooks/IPostDispatchHook.sol";
import { IMessageRecipient } from "@hyperlane-xyz/core/contracts/interfaces/IMessageRecipient.sol";
import { IInterchainSecurityModule, ISpecifiesInterchainSecurityModule } from "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CrosschainSwap is Ownable, IMessageRecipient, ISpecifiesInterchainSecurityModule {
    // ISM for our contract
    IInterchainSecurityModule public interchainSecurityModule;
    // Hyperlane Mailbox contract to listen to
    IMailbox public mailbox;
    // Hyperlane post dispatch hook. Should be MerkleTreeHook contract instance
    IPostDispatchHook public hook;
    // instance of CrosschainSwap in other chain
    address public counterContractInOtherChain;
    // ID of destination chain
    uint32 public destinationChain;

    // Mapping for locked tokens
    mapping(address => mapping(address => uint256)) public tokensLocked;

    event TokensLocked(address indexed user, address indexed token, uint256 amount);
    event TokensUnlocked(address indexed user, address indexed token, uint256 amount);
    event MessageSent(bytes32 messageId);

    modifier onlyMailbox() {
        require(msg.sender == address(mailbox), "This function can be called only by Mailbox");
        _;
    }

    constructor(
        IMailbox _mailbox,
        IPostDispatchHook _hook,
        uint32 _destinationChain,
        IInterchainSecurityModule _ism
    ) Ownable(msg.sender) {
        mailbox = _mailbox;
        hook = _hook;
        destinationChain = _destinationChain;
        interchainSecurityModule = _ism;
    }

    function lockTokens(address token, uint256 amount) public payable {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        tokensLocked[msg.sender][token] += amount;

        bytes memory message = abi.encode(msg.sender, token, amount);
        bytes32 messageId = mailbox.dispatch{value: msg.value}(destinationChain, bytes32(uint256(uint160(counterContractInOtherChain))), message, "");

        emit TokensLocked(msg.sender, token, amount);
        emit MessageSent(messageId);
    }

    function unlockTokens(address user, address token, uint256 amount) external onlyOwner {
        require(tokensLocked[user][token] >= amount, "Insufficient locked balance");
        tokensLocked[user][token] -= amount;
        IERC20(token).transfer(user, amount);

        emit TokensUnlocked(user, token, amount);
    }

    function handle(uint32 _origin, bytes32 _sender, bytes calldata _message) external payable override onlyMailbox {
        require(_origin == destinationChain, "Message was delivered from unknown chain");
        require(address(uint160(uint256(_sender))) == counterContractInOtherChain, "Cross-chain transaction should be initiated by CrosschainSwap");

        (address user, address token, uint256 amount) = abi.decode(_message, (address, address, uint256));
        require(tokensLocked[user][token] >= amount, "Insufficient locked balance");
        tokensLocked[user][token] -= amount;
        IERC20(token).transfer(user, amount);

        emit TokensUnlocked(user, token, amount);
    }

    function setMailboxAddress(IMailbox _mailbox) public onlyOwner {
        mailbox = _mailbox;
    }

    function setHookAddress(IPostDispatchHook _hook) public onlyOwner {
        hook = _hook;
    }

    function setCounterContractInOtherChain(address _counterContractInOtherChain) public onlyOwner {
        counterContractInOtherChain = _counterContractInOtherChain;
    }

    function setDestinationChain(uint32 _destinationChain) public onlyOwner {
        destinationChain = _destinationChain;
    }

    function setInterchainSecurityModule(address _ism) external onlyOwner {
    interchainSecurityModule = IInterchainSecurityModule(_ism);
}
}
