### Lending & Borrowing Protocol
This repository contains smart contracts for a decentralized lending and borrowing protocol. The protocol includes a router contract for managing allowed tokens and lending pools, as well as the lending pool contracts themselves.

## Overview
Router Contract
The LendingRouter contract manages:

## A list of approved lending and collateral tokens.
The creation of LendingPool contracts for specific pairs of lending and collateral tokens.
Querying for the correct LendingPool contract based on token pairs.

## Features
Allowed Tokens Management: The router contract allows the owner to manage a list of approved lending and collateral tokens.
Lending Pool Creation: The owner can create LendingPool contracts for specific pairs of lending and collateral tokens.
Interaction: Users and other contracts can query the router to find the correct LendingPool contract for a specific pair of tokens.

## Deployment
Deploy the LendingRouter contract.
Deploy ERC20 token contracts for lending and collateral tokens if not already deployed.
## Token Approval
Use addAllowedLendingToken to approve tokens that can be used for lending.
function addAllowedLendingToken(address token) external onlyOwner;
Use addAllowedCollateralToken to approve tokens that can be used as collateral.

## function addAllowedCollateralToken(address token) external onlyOwner;
Create Pools
Create specific LendingPool contracts for each allowed token pair using createLendingPool.
function createLendingPool(address lendingToken, address collateralToken) external onlyOwner;
Interaction
Users interact with the LendingPool contracts directly or through a frontend that queries the LendingRouter for the appropriate pool.
function getLendingPool(address lendingToken, address collateralToken) external view returns (address);


these contract its under development

## TODO
implement price
liquidation function
create fornt-end interface
