
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
