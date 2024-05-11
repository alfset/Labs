# Oracle DAO Smart Contract 

### Overview

The VRF DAO Smart Contract is designed to operate within the EVM network, providing decentralized oracle services for external data retrieval such as cryptocurrency prices and random numbers. This is particularly useful for decentralized applications (dApps) requiring external inputs to function correctly, such as in decentralized finance (DeFi) or various forms of decentralized games and lotteries.

# Features : 

# DAO Membership: 
Users can become members of the DAO by staking Native token. Membership allows participation in fee distributions and governance.

## Price Retrieval: 
The contract offers functionalities to update and fetch the prices of various tokens.

https://github.com/alfset/Oracle/assets/42708476/d09f9143-a46d-4f96-be32-977b83c8e2c7



## Random Number Generation: 
Provides secure and verifiable random numbers for applications requiring randomness.

## Proposal System: 
DAO members can propose new features or changes, which can be voted on by other members.

## Dynamic Fee Structure: 
Fees for proposals, price requests, and other features can be adjusted through governance actions.

# Contract Functions

### Administrative Functions :

## initialize(address owner): 
Initializes the contract with the owner address.

## setProposalFee(uint256 newProposalFee): 
Sets a new fee for creating proposals.

## setPriceRetrievalFee(uint256 newPriceRetrievalFee): 
Sets the fee for price data retrieval requests.

## setMaxMembers(uint256 newMaxMembers):
Sets the maximum number of members allowed in the DAO.

## setMinStake(uint256 newMinStake): 
Sets the minimum stake required to become a member of the DAO.

##setRequestFee(uint256 newRequestFee): 
Sets the fee required to request new price data.

### User Interaction Functions

## joinDAO(): 
Allows a user to join the DAO by staking the required ammount of native.

## leaveDAO(uint256 withdrawAmount): 
Allows a member to leave the DAO and withdraw their staked amount.

## addStake(): 
Allows a member to increase their stake in the DAO.

## withdraw(uint256 amount): 
Withdraws a specified amount from the user’s staked balance, removing them from the DAO if their remaining stake falls below the required minimum.

### Oracle Functions

## requestPriceData(string memory symbol):
Requests the latest price data for a given token symbol.
## updatePrice(string memory symbol, uint256 price): 
Updates the stored price for a given token.
## getPrice(bytes32 priceId):
Retrieves the price associated with a given price ID.

### Random Number Functions

## requestRandomNumber(): 
Requests the generation of a random number.
## fulfillRandomNumber(bytes32 requestId, uint256 randomNumber): 
Submits the generated random number for a given request.

### Governance Functions

## openProposal(string memory description): 
Opens a new proposal for changes or features to be added to the DAO.

## distributeFees(): 
Distributes collected fees to DAO members according to their stake percentage. 


### Events

Various events such as PriceUpdated, StakeDeposited, StakeWithdrawn, FeesDistributed, and others provide transparency and traceability for actions within the contract.

### Security Features


## Ownable Pattern:
Restricts sensitive functions to the contract owner, enhancing administrative control.


## Stake Requirements: 
Aligns incentives and reduces spam by requiring a stake to participate in the DAO and its benefits.


### Deployment

This contract is deployed on the EVM network and can be interacted with using standard EVM wallets and development tools like MetaMask and Truffle Suite.

[Planq Testnet](https://explorer.planq.network/address/0xE62a3277429B9F26C466D31157D50CaE97561e7C?tab=contract "Oracle")
[Planq Mainnet](https://evm.planq.network/address/0x7b4c331cC2CB5D638D3c3c8145DE2BE9C276e7ca?tab=contract "Oracle")
[OP Sepolia](https://sepolia-optimism.etherscan.io/address/0x730de67Bf353F8d9B2648Cf0af9681b265f06b3A#code "Oracle")
[Base Sepolia](https://base-sepolia.blockscout.com/address/0x730de67Bf353F8d9B2648Cf0af9681b265f06b3A?tab=contract "Oracle")
[Scroll Sepolia](https://sepolia.scrollscan.com/address/0x730de67bf353f8d9b2648cf0af9681b265f06b3a#readContract "Oracle")
[Swisstronik Testnet](https://explorer-evm.testnet.swisstronik.com/address/0xA1bB5791dC0d6939Bf05AEbCB57DBaeBd46684a4/contracts#address-tabs "Oracle")


### Example for consumer contract
[Consumer Contract](https://github.com/alfset/Oracle/blob/main/contract/consumer.sol "Consumer")

[Liquidity Swap ](https://github.com/alfset/Oracle/blob/main/contract/exampleConsumer/LiquiditySwap.sol "Swap And Liquidity")



### and example Liqudity and swap contract that deployed on Planq
[Swap And Pool](https://explorer.planq.network/address/0xcfeD0D58048068e5af1a7D6B872ca4d012E435Af "DEFI Example")

### Join our DAO
[DAO Dapps](https://oracle.dao.comunitynode.my.id/ "DAO")


### supported price pair

## Planq Network Mainnet

### Price ID

Here are the contract addresses for various tokens and pairs:

- **PlanqUSD**: `0xbaab347fde53e8137b9ac9ff320cb250871a6becda1619f759843e705a630b24`
- **PlanqCiento**: `0x9897c3030d3ba9686f84f6101c9e35a836ce8c32f5637b3b8dd3b264825ded9c`
- **PlanqDelta**: `0x5e0f1a8e9e3615e38842d3ad017d6f25c651b447c1f494de55851d2167624ec7`
- **PlanqEth**: `0x9bfdd0313979e8d849abc88dca3df8f50a8c355dc374a92edd19dbb44293496f`
- **PlanqBsc**: `0x03192fdb9c645e8a8256a401c4ddffffe818e6eed2ad0a2a02ff24dcb32b7838`
- **PlanqBtc**: `0x86e517073ffa2b59cb28d574db0b3b95af73c505241eb4df43678bd0104be4b4`
- **BnbUsd**: `0xfe12d195db17629f7a94905a0b1e1ed8a8126a4efb1f715aaf3955fb682ba558`
- **MaticUsd**: `0xa1db8d8b4ce22aff08cb99c6e20018fc8d65e681a0556ed148c5b6dfd85d9e1a`
- **EthUsd**: `0xf7587776fe566579c7e043761cc9a2ee86be9b42b3650ce52775b87e78abacdb`
- **BtcUsd**: `0xe1d91f07de8d41651e96735f203a2b6029bdb095dd1476f2b96f28bc56c371c0`
- **PlanqMatic**: `0xe616a3a8262767157a9c36a14a4fa0c3b69ed142768b50b4367c7c0b897209d9`

Please refer to these Price ID addresses for interacting with the corresponding tokens and pairs on the blockchain.

## Swisstronik Testnet

### Price ID

- **BTCUSD**: `0xeecd89730733dbc3ee535a72ec7b19fa43043ff8c639fce70da03fab50592937`
- **ETHUSD**: `0xd9821d709920bb5148244aa942482f43ed013709abf6c1a93b724e515e593830`
- **ATOMUSD**: `0x8ee6cbb30ef954e2c0dd36f056d75bf10564bea58f1f915c8e3a2d02c4d7161c`
- **BTCETH**: `0xf989b90649c53faa3b98b54ad150b0798d88d4eb55defa485229eaef2a352e69`
- **BTCATOM**: `0x5c2f06fd76d285a8b7d933d8473756b34418ee35b6f7740eb478201bf70d8117`
- **ETHATOM**: `0x1827b65902f674b891f5c5cac0f4e13c539cb44125d287d0dd7b4ef368d48799`
- **PLANQUSD**: `0xa705944016d06b449b815e4426ad4f2f9822913c8e8d5955329439ba7f8614e6`
- **BTCPLANQ**: `0xa80f4684094c4abce748c1c1c07fffc870d10c67515ca29424ec614857d6c9e0`
- **ETHPLANQ**: `0x9c2c110783de11e0c09ee576e951e06967de74a4ef2a98e5dee2e063d0679a41`
- **ATOMPLANQ**: `0x71450db33253b1efecb6868e33754b6185786302fa09a1833a8aa5155b7b609e`

