// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

// Multi-Sig Wallet with integrated token bridge functionality
contract MultiSigWalletWithBridge {
    mapping(address => bool) public isOwner;
    address[] public owners;
    uint public requiredConfirmations;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint confirmations;
        string chainIdentifier;
    }

    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public isConfirmed;
    mapping(string => bool) public supportedChains;

    IERC20 public token; // ERC20 token for the bridge

    // Events
    event SubmitTransaction(address indexed owner, uint indexed txIndex, address indexed to, uint value, bytes data, string chainIdentifier);
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint indexed txIndex);
    event ChainSupported(string chainIdentifier, bool status);
    event Locked(address indexed sender, uint256 amount, string destination);
    event Unlocked(address indexed recipient, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "Transaction does not exist");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "Transaction already executed");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "Transaction already confirmed");
        _;
    }

    constructor(address[] memory _owners, uint _requiredConfirmations, address _tokenAddress) {
        require(_owners.length > 0, "Owners required");
        require(_requiredConfirmations > 0 && _requiredConfirmations <= _owners.length, "Invalid number of required confirmations");
        token = IERC20(_tokenAddress); // Initialize the token for the bridge

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        requiredConfirmations = _requiredConfirmations;
    }

    function setChainSupport(string calldata chainIdentifier, bool status) public onlyOwner {
        supportedChains[chainIdentifier] = status;
        emit ChainSupported(chainIdentifier, status);
    }

    function submitTransaction(address _to, uint _value, bytes calldata _data, string calldata _chainIdentifier) public onlyOwner {
        require(supportedChains[_chainIdentifier], "Unsupported chain");
        uint txIndex = transactions.length;
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            confirmations: 0,
            chainIdentifier: _chainIdentifier
        }));
        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data, _chainIdentifier);
    }

    function lockTokens(uint256 _amount, string memory _destination) public onlyOwner {
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        emit Locked(msg.sender, _amount, _destination);
    }

    function unlockTokens(address _recipient, uint256 _amount) public onlyOwner {
        require(token.transfer(_recipient, _amount), "Transfer failed");
        emit Unlocked(_recipient, _amount);
    }
}
