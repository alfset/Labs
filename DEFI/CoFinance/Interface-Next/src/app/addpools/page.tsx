'use client';
import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import tokens from '../../data/token.json';
import { Button } from '../../components/ui/moving-border';
import { ethers } from 'ethers';

// Replace with your smart contract ABI and address
const COFINANCE_FACTORY_ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "tokenA", "type": "address" },
      { "name": "tokenB", "type": "address" },
      { "name": "rewardToken", "type": "address" },
      { "name": "priceFeed", "type": "address" },
      { "name": "liquidityToken", "type": "address" },
      { "name": "stakingContract", "type": "address" },
      { "name": "isPoolIncentivized", "type": "bool" }
    ],
    "name": "createCoFinanceContract",
    "outputs": [{ "name": "", "type": "address" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const COFINANCE_FACTORY_ADDRESS = ''; // Replace with your actual contract address

const customStyles = {
  control: (base) => ({
    ...base,
    background: 'rgba(0, 0, 0, 0.7)', // Glossy black
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white'
  }),
  menu: (base) => ({
    ...base,
    background: 'rgba(0, 0, 0, 0.7)', // Glossy black
  }),
  option: (base, { isFocused }) => ({
    ...base,
    background: isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    color: 'white',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white',
  }),
  input: (base) => ({
    ...base,
    color: 'white',
  }),
};

const CustomOption = (props) => (
  <components.Option {...props}>
    <div className="flex items-center">
      <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2" />
      {props.data.label}
    </div>
  </components.Option>
);

const CustomSingleValue = (props) => (
  <components.SingleValue {...props}>
    <div className="flex items-center">
      <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2" />
      {props.data.label}
    </div>
  </components.SingleValue>
);

function AddPool() {
  const [tokenA, setTokenA] = useState<{ value: string; label: string; image: string } | null>(null);
  const [tokenB, setTokenB] = useState<{ value: string; label: string; image: string } | null>(null);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [poolName, setPoolName] = useState('');
  const [priceFeed, setPriceFeed] = useState('');
  const [rewardToken, setRewardToken] = useState('');
  const [liquidityToken, setLiquidityToken] = useState('');
  const [isIncentivized, setIsIncentivized] = useState(false);

  const tokenOptions = tokens.tokens.map((token) => ({
    value: token.address, // Assuming you have addresses in token.json
    label: token.name,
    image: token.image,
  }));

  useEffect(() => {
    if (tokenA && tokenB) {
      // Set the liquidity token name based on tokenA and tokenB names
      setLiquidityToken(`${tokenA.label}-${tokenB.label}`);
    }
  }, [tokenA, tokenB]);

  const handleAddPool = async () => {
    if (!tokenA || !tokenB || !rewardToken || !priceFeed) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      // Initialize ethers provider and contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const coFinanceFactory = new ethers.Contract(COFINANCE_FACTORY_ADDRESS, COFINANCE_FACTORY_ABI, signer);

      // Call the createCoFinanceContract function
      const tx = await coFinanceFactory.createCoFinanceContract(
        tokenA.value,        // Token A address
        tokenB.value,        // Token B address
        rewardToken,         // Reward Token address from input
        priceFeed,           // Price Feed Address from input
        liquidityToken,     // Auto-populated liquidity token name
        'STAKING_CONTRACT_ADDRESS', // Replace with actual staking contract address
        isIncentivized       // Incentivized pool flag
      );

      // Wait for the transaction to be mined
      await tx.wait();

      // Inform the user about the successful creation
      alert('Pool added successfully');
      console.log('Pool added successfully. Contract address:', tx.address);

    } catch (error) {
      console.error('Error adding pool:', error);
      alert('Error adding pool. Please check the console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">Add Liquidity to Pool</h1>

      <div className="text-center text-white mb-12">
        {/* Display wallet address or other info if needed */}
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm">
          <div className="mb-4">
            <input
              type="text"
              value={poolName}
              onChange={(e) => setPoolName(e.target.value)}
              placeholder="Pool Name"
              className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
            />
          </div>
          <div className="mb-4">
            <Select
              options={tokenOptions}
              value={tokenA}
              onChange={setTokenA}
              styles={customStyles}
              components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
              placeholder="Select Token A"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              value={amountA}
              onChange={(e) => setAmountA(e.target.value)}
              placeholder="Amount of Token A"
              className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
            />
          </div>
          <div className="mb-4">
            <Select
              options={tokenOptions}
              value={tokenB}
              onChange={setTokenB}
              styles={customStyles}
              components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
              placeholder="Select Token B"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              value={amountB}
              onChange={(e) => setAmountB(e.target.value)}
              placeholder="Amount of Token B"
              className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={priceFeed}
              onChange={(e) => setPriceFeed(e.target.value)}
              placeholder="Price Feed Address"
              className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={rewardToken}
              onChange={(e) => setRewardToken(e.target.value)}
              placeholder="Reward Token Address"
              className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={liquidityToken}
              readOnly
              placeholder="Liquidity Token Name"
              className="w-full p-2 bg-transparent border border-gray-600 rounded text-white"
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={isIncentivized}
              onChange={(e) => setIsIncentivized(e.target.checked)}
              className="mr-2"
            />
            <span className="text-white">Incentivized Pool</span>
          </div>
          <div className="text-center">
            <Button
              onClick={handleAddPool}
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition duration-300 text-white py-2 px-4 rounded-lg"
            >
              Add Pool
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPool;
