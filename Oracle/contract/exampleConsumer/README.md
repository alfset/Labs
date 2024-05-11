
# Overview

The LiquidityPool is a decentralized finance (DeFi) smart contract deployed on Ethereum-compatible blockchains. It integrates with an external Oracle to accurately fetch and update the prices of ERC20 tokens, ensuring fair trading conditions within the ecosystem. This contract primarily manages two types of tokens, referred to as tokenA and tokenB.

## Contract Features

# Initialization
Upon deployment, the contract is initialized with the necessary parameters to ensure it interacts correctly with other blockchain components:

Oracle Address: The address of the Oracle contract used for fetching price updates.
Token Addresses: Addresses of the two ERC20 tokens (tokenA and tokenB).
Token Symbols: The symbols associated with tokenA and tokenB, used for price retrieval and updates.
Price Update Mechanism
The contract includes an updatePrice function to fetch and update the price of a specified token symbol from the Oracle. This is crucial for maintaining up-to-date and accurate pricing information within the liquidity pool.

## updatePrice Function

Parameter: symbol - The token symbol for which the price is to be updated.
Payable: This function is payable and may require sending Ether to cover Oracle service fees.
Events
ReceivedPrice: Triggered when a price is successfully fetched from the Oracle.
PriceUpdated: Triggered when a price is successfully updated in the contract's storage.

# Getting Started

## Prerequisites
An Ethereum wallet with Ether for deploying and interacting with the contract.
ERC20 token addresses that you wish to manage in the liquidity pool.
Deployment
Compile the LiquidityPool contract using Remix or Hardhat with Solidity ^0.8.0.
Deploy the contract to an Ethereum-compatible network, specifying the Oracle and ERC20 token parameters.
Verify the contract on Etherscan for public visibility and interaction.
Interactions
Add Liquidity: Token holders can add liquidity by depositing tokenA and tokenB in respective amounts.
Remove Liquidity: Liquidity providers can withdraw their contributed liquidity proportionally in both tokens.
Token Swap: Participants can swap tokenA for tokenB or vice versa based on real-time prices fetched from the Oracle.

# Supported network

consider use these Price ID and smart contract deployment

### Deployment

This contract is deployed on the EVM network and can be interacted with using standard EVM wallets and development tools like MetaMask and Truffle Suite.

[Planq Testnet](https://explorer.planq.network/address/0xE62a3277429B9F26C466D31157D50CaE97561e7C?tab=contract "Oracle")
[Planq Mainnet](https://evm.planq.network/address/0x7b4c331cC2CB5D638D3c3c8145DE2BE9C276e7ca?tab=contract "Oracle")
[OP Sepolia](https://sepolia-optimism.etherscan.io/address/0x730de67Bf353F8d9B2648Cf0af9681b265f06b3A#code "Oracle")
[Base Sepolia](https://base-sepolia.blockscout.com/address/0x730de67Bf353F8d9B2648Cf0af9681b265f06b3A?tab=contract "Oracle")
[Scroll Sepolia](https://sepolia.scrollscan.com/address/0x730de67bf353f8d9b2648cf0af9681b265f06b3a#readContract "Oracle")
[Swisstronik Testnet](https://explorer-evm.testnet.swisstronik.com/address/0xA1bB5791dC0d6939Bf05AEbCB57DBaeBd46684a4/contracts#address-tabs "Oracle")


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

