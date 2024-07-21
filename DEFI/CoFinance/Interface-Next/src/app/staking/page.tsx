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

// Define the staking duration options
const stakingDurations = [
  { value: 21, label: '7 Days' },
  { value: 5, label: '14 Days' },
  { value: 7, label: '21 Days' },
];

function Staking() {
  const [selectedToken, setSelectedToken] = useState<{ value: string; label: string; image: string } | null>(null);
  const [amount, setAmount] = useState('');
  const [stakingDuration, setStakingDuration] = useState<{ value: number; label: string } | null>(null);
  const [apr, setApr] = useState<number | null>(null);

  const tokenOptions = tokens.tokens.map((token) => ({
    value: token.name,
    label: token.name,
    image: token.image,
  }));

  const calculateApr = () => {
    if (selectedToken && stakingDuration) {
      const baseApr = 5; // Base APR
      const durationMultiplier = stakingDuration.value / 21; // Example multiplier
      setApr(baseApr * durationMultiplier);
    } else {
      setApr(null);
    }
  };

  const handleStake = () => {
    calculateApr();
    // Add staking logic here
    console.log('Staking', amount, 'of', selectedToken, 'for', stakingDuration);
  };

  return (
    <div className="min-h-screen bg-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">Stake Tokens</h1>

      <div className="flex justify-center mb-12">
        <div className="bg-glossy-black p-6 rounded-lg shadow-lg w-full max-w-md">
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
            <label className="block text-white mb-2">Staking Duration</label>
            <div className="grid grid-cols-2 gap-4">
              {stakingDurations.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => {
                    setStakingDuration(duration);
                    calculateApr(); // Recalculate APR on selection
                  }}
                  className={`p-4 rounded-lg text-white ${stakingDuration?.value === duration.value ? 'bg-green-500' : 'bg-gray-700'} border border-gray-600`}
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </div>
          {apr !== null && (
            <div className="mb-4 text-white">
              <p>Estimated APR: {apr.toFixed(2)}%</p>
            </div>
          )}
          <button
            onClick={handleStake}
            className="w-full py-2 bg-green-500 rounded-xl text-white font-bold"
          >
            Confirm Stake
          </button>
        </div>
      </div>
    </div>
  );
}

export default Staking;
