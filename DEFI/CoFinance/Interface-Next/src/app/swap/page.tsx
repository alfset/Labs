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

function Swap() {
  const [fromToken, setFromToken] = useState<{ value: string; label: string; image: string } | null>(null);
  const [toToken, setToToken] = useState<{ value: string; label: string; image: string } | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const tokenOptions = tokens.tokens.map((token) => ({
    value: token.name,
    label: token.name,
    image: token.image,
  }));

  const handleSwap = () => {
    // Add swap logic here
    console.log('Swapping', fromAmount, fromToken, 'to', toAmount, toToken);
  };

  return (
    <div className="min-h-screen bg-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">Swap Tokens</h1>

      <div className="text-center text-white mb-12">
        {/* Display wallet address if needed */}
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-glossy-black p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="mb-4">
            <label className="block text-white mb-2">From Token</label>
            <Select
              options={tokenOptions}
              value={fromToken}
              onChange={setFromToken}
              styles={customStyles}
              components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
              placeholder="Select token"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Amount</label>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 bg-transparent border border-gray-600 text-white rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">To Token</label>
            <Select
              options={tokenOptions}
              value={toToken}
              onChange={setToToken}
              styles={customStyles}
              components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
              placeholder="Select token"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Amount</label>
            <input
              type="number"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 bg-transparent border border-gray-600 text-white rounded"
            />
          </div>
          <button
            onClick={handleSwap}
            className="w-full py-2 bg-green-500 rounded-xl text-white font-bold"
          >
            Confirm Swap
          </button>
        </div>
      </div>
    </div>
  );
}

export default Swap;
