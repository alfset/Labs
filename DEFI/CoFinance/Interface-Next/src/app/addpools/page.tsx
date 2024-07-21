'use client';
import React, { useState } from 'react';
import Select, { components } from 'react-select';
import tokens from '../../data/token.json';

// Custom styles for react-select
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

// Custom Option component to display image in the select dropdown
const CustomOption = (props) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center">
        <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2" />
        {props.data.label}
      </div>
    </components.Option>
  );
};

// Custom SingleValue component to display image in the selected value
const CustomSingleValue = (props) => {
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center">
        <img src={props.data.image} alt={props.data.label} className="w-6 h-6 mr-2" />
        {props.data.label}
      </div>
    </components.SingleValue>
  );
};

function AddPool() {
  const [tokenA, setTokenA] = useState<{ value: string; label: string; image: string } | null>(null);
  const [tokenB, setTokenB] = useState<{ value: string; label: string; image: string } | null>(null);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');

  const tokenOptions = tokens.tokens.map((token) => ({
    value: token.name,
    label: token.name,
    image: token.image,
  }));

  const handleAddPool = () => {
    // Add pool logic here
    console.log('Adding liquidity:', amountA, tokenA, 'and', amountB, tokenB);
  };

  return (
    <div className="min-h-screen bg-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">Add Liquidity to Pool</h1>

      <div className="text-center text-white mb-12">
        {/* Display wallet address or other info if needed */}
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-glossy-black p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="mb-4">
            <label className="block text-white mb-2">Token A</label>
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
            <label className="block text-white mb-2">Amount of Token A</label>
            <input
              type="number"
              value={amountA}
              onChange={(e) => setAmountA(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Token B</label>
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
            <label className="block text-white mb-2">Amount of Token B</label>
            <input
              type="number"
              value={amountB}
              onChange={(e) => setAmountB(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            />
          </div>
          <button
            onClick={handleAddPool}
            className="w-full py-2 bg-green-500 rounded-xl text-white font-bold"
          >
            Confirm Add to Pool
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPool;
