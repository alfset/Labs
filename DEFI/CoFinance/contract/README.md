
# CoFinanceFactory Contract

## Overview

The `CoFinanceFactory` contract is a factory contract designed for creating liquidity pools and managing their interactions. It allows users to create new liquidity pools with specific tokens and handle their associated liquidity and rewards.

## Table of Contents

- [Contract Description](#contract-description)
- [Deployment Instructions](#deployment-instructions)
- [Contract Interactions](#contract-interactions)
- [Formulas](#formulas)
- [Detailed Formula Breakdown](#detailed-formula-breakdown)

## Contract Description

The `CoFinanceFactory` contract provides functionality to:

- Create liquidity pools with specified tokens.
- Manage and retrieve pool information.
- Emit events when new pools are created.

### Key Functions

- `createPool`: Creates a new liquidity pool with the given parameters.
- `getAllPools`: Returns a list of all created pools.
- `getPoolByToken`: Returns a list of pools associated with a specific token.
- `getPoolByPair`: Returns the address of the pool for a given pair of tokens.

## Deployment Instructions

### Prerequisites

- Node.js and npm installed
- Hardhat installed (`npm install --save-dev hardhat`)
- OpenZeppelin Hardhat Upgrades plugin installed (`npm install --save-dev @openzeppelin/hardhat-upgrades`)

### Deployment Script

Create a file named `deploy.js` in the `scripts` directory with the following content:

```javascript
const hre = require("hardhat");

async function main() {
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the CoFinanceFactory contract
  const CoFinanceFactory = await hre.ethers.getContractFactory("CoFinanceFactory");
  console.log("Deploying CoFinanceFactory...");
  const coFinanceFactory = await CoFinanceFactory.deploy();

  // Wait for the deployment transaction to be mined
  await coFinanceFactory.deployTransaction.wait();
  console.log(`CoFinanceFactory contract deployed to ${coFinanceFactory.address}`);
}

// Run the deployment script and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### Running the Deployment

Execute the deployment script using Hardhat:

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

Replace `<network-name>` with your target network (e.g., `rinkeby`, `mainnet`).

## Contract Interactions

### Create a Pool

To create a new pool, use the `createPool` function:

```javascript
await coFinanceFactory.createPool(
  tokenAAddress,
  tokenBAddress,
  rewardTokenAddress,
  priceFeedAddress,
  "LiquidityTokenName",
  "LQTY",
  stakingContractAddress,
  isPoolIncentivized
);
```

### Retrieve Pool Information

- **Get All Pools**:

```javascript
const allPools = await coFinanceFactory.getAllPools();
```

- **Get Pools by Token**:

```javascript
const poolsByToken = await coFinanceFactory.getPoolByToken(tokenAddress);
```

- **Get Pool by Token Pair**:

```javascript
const poolAddress = await coFinanceFactory.getPoolByPair(tokenAAddress, tokenBAddress);
```

## Formulas

### Total Value Locked (TVL)

TVL is the sum of all assets held within the pool. It can be calculated as:

$$
\text{TVL} = \text{Liquidity Token Amount} \times \text{Token Price}
$$

### Collateral

Collateral refers to the assets provided to support borrowing. It can be calculated as:

$$
\text{Collateral} = \text{Amount of Collateral Token} \times \text{Collateral Token Price}
$$

### Swap

Swapping involves exchanging one token for another within the pool. The swap amount is calculated based on the pool's liquidity and the swap formula.

### Liquidity

Liquidity in a pool is measured by the amount of tokens available for trading. The liquidity formula is:

$$
\text{Liquidity} = \text{Amount of Token A} + \text{Amount of Token B}
$$

## Detailed Formula Breakdown

### Swap Fee Calculation

#### Without Dynamic Price Feed

- **Fee Calculation**:
  $$
  \text{tokenAFee} = \frac{\text{tokenAmount} \times \text{SWAP\_FEE\_PERCENT}}{1000}
  $$

- **Amount After Fee**:
  $$
  \text{tokenAAmountAfterFee} = \text{tokenAmount} - \text{tokenAFee}
  $$

#### With Dynamic Price Feed

- **Fee Calculation**:
  $$
  \text{tokenAFee} = \frac{(\text{tokenAmount} \times \text{SWAP\_FEE\_PERCENT}) \times \text{price}}{1000 \times 10^{18}}
  $$

- **Amount After Fee**:
  $$
  \text{tokenAAmountAfterFee} = \text{tokenAmount} - \text{tokenAFee}
  $$

### Liquidity Provision Formula

#### Initial Liquidity Provision

When adding liquidity to the pool for the first time (i.e., when the total supply of liquidity tokens is zero), the amount of liquidity tokens minted is calculated based on the square root of the product of the provided token amounts:

$$
\text{LiquidityMinted} = \sqrt{\text{TokenAAmount} \times \text{TokenBAmount}}
$$

where:
- \(\text{TokenAAmount}\) is the amount of Token A provided.
- \(\text{TokenBAmount}\) is the amount of Token B provided.

#### Subsequent Liquidity Provision

For subsequent liquidity provision (when there is already existing liquidity in the pool), the amount of liquidity tokens minted is calculated proportionally based on the existing reserves of Token A and Token B in the pool:

$$
\text{LiquidityMinted} = \min \left( \frac{\text{TokenAAmount} \times \text{LiquidityTotalSupply}}{\text{ReserveA}}, \frac{\text{TokenBAmount} \times \text{LiquidityTotalSupply}}{\text{ReserveB}} \right)
$$

where:
- \(\text{LiquidityTotalSupply}\) is the total supply of liquidity tokens in circulation.
- \(\text{ReserveA}\) is the current reserve of Token A in the pool.
- \(\text{ReserveB}\) is the current reserve of Token B in the pool.

### Loan Calculations

#### Collateral

- **Calculation**:
  $$
  \text{collateralAmountRequired} = \frac{\text{loanAmount} \times 100}{\text{MAX\_LTV\_PERCENT}}
  $$

#### Interest Calculation

- **Interest Fee Balance**:
  $$
  \text{interestFeeBalance} = \text{interestFeeBalance} + \frac{\text{loanAmount} \times \text{INTEREST\_RATE} \times (\text{block.timestamp} - \text{loanStartTime[msg.sender]})}{100 \times 365 \text{ days}}
  $$

### Staking Rewards Calculation

- **Reward Calculation**:
  $$
  \text{reward} = \frac{\text{stakedAmount} \times \text{rewardRate} \times \text{stakeDuration}}{365 \text{ days}}
  $$

### Fee Withdrawals

#### Swap Fee Withdrawal

- **Calculation**:
  $$
  \text{amount} = \frac{\text{swapFeeBalance} \times \text{OWNER\_SHARE\_PERCENT}}{100}
  $$

#### Interest Fee Withdrawal

- **Calculation**:
  $$
  \text{amount} = \frac{\text{interestFeeBalance} \times \text{OWNER\_SHARE\_PERCENT}}{100}
  $$
```
