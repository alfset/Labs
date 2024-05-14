// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Initializable.sol";
import "./OwnableUpgradeable.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import "./IERC20.sol";
import "./IOracle.sol";
import "./LiquidityPool.sol";

contract CrossChainSwap is Initializable, OwnableUpgradeable {
    IMailbox public mailbox;
    IOracle public oracle;
    uint32 public originChainId;
    uint32 public destinationChainId;
    address public destinationLiquidityPool;

    event SwapInitialized(address indexed user, uint256 amount, string tokenSymbol, uint256 price);
    event SwapExecuted(address indexed user, uint256 amount, string tokenSymbol, uint256 price);

    function initialize(
        address _mailbox,
        address _oracle,
        uint32 _originChainId,
        uint32 _destinationChainId,
        address _destinationLiquidityPool
    ) public initializer{
        __Ownable_init(msg.sender);
        mailbox = IMailbox(_mailbox);
        oracle = IOracle(_oracle);
        originChainId = _originChainId;
        destinationChainId = _destinationChainId;
        destinationLiquidityPool = _destinationLiquidityPool;
    }

    function initiateSwap(address tokenAddress, uint256 amount, string memory tokenSymbol) public {
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        uint256 price = oracle.getPrice(oracle.getPriceId(tokenSymbol));

        emit SwapInitialized(msg.sender, amount, tokenSymbol, price);

        bytes memory data = abi.encodeWithSignature("executeSwap(address,uint256,string,uint256)",
            msg.sender, amount, tokenSymbol, price);

        mailbox.dispatch(destinationChainId, bytes32(uint256(uint160(destinationLiquidityPool))), data, new bytes(0));
    }

    function handle(uint32 _origin, bytes32, bytes calldata _message) external {
        require(_origin == destinationChainId, "Invalid origin chain");
        (address user, uint256 amount, string memory tokenSymbol, uint256 price) = abi.decode(_message, (address, uint256, string, uint256));
        LiquidityPool(destinationLiquidityPool).swapTokenAForTokenB(amount);

        emit SwapExecuted(user, amount, tokenSymbol, price);
    }

    function setDestinationLiquidityPool(address _pool) public onlyOwner {
        destinationLiquidityPool = _pool;
    }

    function setDestinationChainId(uint32 _chainId) public onlyOwner {
        destinationChainId = _chainId;
    }
}
