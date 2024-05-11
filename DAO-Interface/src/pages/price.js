const { ethers } = require('ethers');

// Configuration for the network and smart contract
const provider = new ethers.providers.JsonRpcProvider('https://planq-rpc.nodies.app');
const contractAddress = '0xB20E11B2a37507e808c4A80A8b23e6406Aa758Dd';
const privateKey = 'd5848e92a1f33c3155d06988220b5e4091680ce96dfc3887cf0e7b9fd04e741f';  // Securely manage your private key
const wallet = new ethers.Wallet(privateKey, provider);

// ABI for the functions we are interested in
const contractABI = [
    {
        "inputs": [{"internalType": "address", "name": "tokenA", "type": "address"}, {"internalType": "address", "name": "tokenB", "type": "address"}, {"internalType": "uint256", "name": "amountIn", "type": "uint256"}],
        "name": "getAmountsOut",
        "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// Connect to the contract
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Token addresses (example: DAI and WETH)
const tokenA = '0xB20E11B2a37507e808c4A80A8b23e6406Aa758Dd'; // DAI address
const tokenB = '0x3C28a6Edc11746bf45c7fe0A2bCF95e27abc7bBa'; // WETH address
const amountIn = ethers.utils.parseEther("1"); // Example: estimating price for 1 DAI

async function fetchTokenPrice() {
    try {
        // Calling getAmountsOut to fetch the price
        const amountsOut = await contract.getAmountsOut(amountIn, [tokenA, tokenB]);
        console.log(`Amounts Out: ${amountsOut}`);

        // The last element in amountsOut array will be the amount of tokenB you get for your tokenA
        const priceInTokenB = amountsOut[1];
        console.log(`Price of 1 ${tokenA} in ${tokenB}: ${ethers.utils.formatEther(priceInTokenB)} ${tokenB}`);
    } catch (error) {
        console.error(`Failed to fetch token price: ${error}`);
    }
}

fetchTokenPrice();
