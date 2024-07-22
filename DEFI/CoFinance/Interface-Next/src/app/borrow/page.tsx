'use client';
import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import tokens from '../../data/token.json';
import { Button } from '../../components/ui/moving-border';

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

// Define the borrowing duration options
const borrowingDurations = [
  { value: 10, label: '30 Days' },
  { value: 30, label: '60 Days' },
  { value: 50, label: '90 Days' },
];

function Borrow() {
  const [selectedToken, setSelectedToken] = useState<{ value: string; label: string; image: string } | null>(null);
  const [amount, setAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowingDuration, setBorrowingDuration] = useState<{ value: number; label: string } | null>(null);
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const [tvl, setTVL] = useState<number>(1000000); // Example TVL

  const tokenOptions = tokens.tokens.map((token) => ({
    value: token.name,
    label: token.name,
    image: token.image,
  }));

  const calculateInterestRate = () => {
    if (selectedToken && borrowingDuration) {
      const baseRate = 3; // Base Interest Rate
      const durationMultiplier = borrowingDuration.value / 30; // Example multiplier
      setInterestRate(baseRate * durationMultiplier);
    } else {
      setInterestRate(null);
    }
  };

  const handleBorrow = () => {
    calculateInterestRate();
    // Add borrowing logic here
    console.log('Borrowing', amount, 'of', selectedToken, 'for', borrowingDuration);
  };

  useEffect(() => {
    calculateInterestRate(); // Recalculate on token or duration change
  }, [selectedToken, borrowingDuration]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">Borrow Tokens</h1>

      {/* Summary Section */}
      <div className="flex justify-center mb-12">
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm">
          <h2 className="text-lg font-bold mb-4 text-white">Summary</h2>
          <ul className="text-white space-y-4">
            <li className="flex justify-between">
              <span>Borrowed Token:</span>
              <span>{selectedToken?.label || 'None'}</span>
            </li>
            <li className="flex justify-between">
              <span>Borrowed Amount:</span>
              <span>{amount || '0'}</span>
            </li>
            <li className="flex justify-between">
              <span>Collateral Amount:</span>
              <span>{collateralAmount || '0'}</span>
            </li>
            <li className="flex justify-between">
              <span>TVL:</span>
              <span>${tvl.toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span>Days Until Borrowing Ends:</span>
              <span>{borrowingDuration?.label || 'N/A'}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Borrow Form */}
      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm">
          <div className="mb-4">
            <label className="block text-white mb-2">Token</label>
            <Select
              options={tokenOptions}
              value={selectedToken}
              onChange={setSelectedToken}
              styles={customStyles}
              components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
              placeholder="Select token"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 bg-black bg-opacity-60 border border-gray-600 rounded text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Collateral Amount</label>
            <input
              type="number"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              placeholder="Collateral Amount"
              className="w-full p-2 bg-black bg-opacity-60 border border-gray-600 rounded text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Borrowing Duration</label>
            <div className="grid grid-cols-3 gap-4">
              {borrowingDurations.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => {
                    setBorrowingDuration(duration);
                    calculateInterestRate(); // Recalculate Interest Rate on selection
                  }}
                  className={`p-4 rounded-lg text-white border border-gray-600 ${borrowingDuration?.value === duration.value ? 'bg-green-500' : 'bg-transparent'} border-opacity-70`}
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </div>
          {interestRate !== null && (
            <div className="mb-4 text-white">
              <p>Estimated Interest Rate: {interestRate.toFixed(2)}%</p>
            </div>
          )}
          <Button onClick={handleBorrow}>
            Confirm Borrow
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Borrow;
