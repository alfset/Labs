'use client';
import React from 'react';
import { components } from 'react-select'; // Ensure to import components
import tokens from '../../data/token.json';

// Dummy pool data
const pools = [
  {
    id: '1',
    tokenA: 'Token A',
    tokenB: 'Token B',
    liquidity: '1000',
    imageA: '/planq.jpg',
    imageB: '/planq.jpg'
  },
  {
    id: '2',
    tokenA: 'Token C',
    tokenB: 'Token D',
    liquidity: '500',
    imageA: '/planq.jpg',
    imageB: '/planq.jpg'
  },
  {
    id: '3',
    tokenA: 'Token C',
    tokenB: 'Token D',
    liquidity: '500',
    imageA: '/planq.jpg',
    imageB: '/planq.jpg'
  },
  {
    id: '4',
    tokenA: 'Token C',
    tokenB: 'Token D',
    liquidity: '500',
    imageA: '/planq.jpg',
    imageB: '/planq.jpg'
  },
  {
    id: '5',
    tokenA: 'Token C',
    tokenB: 'Token D',
    liquidity: '500',
    imageA: '/planq.jpg',
    imageB: '/planq.jpg'
  },
  {
    id: '6',
    tokenA: 'Token C',
    tokenB: 'Token D',
    liquidity: '500',
    imageA: '/planq.jpg',
    imageB: '/planq.jpg'
  },
  {
    id: '7',
    tokenA: 'Token C',
    tokenB: 'Token D',
    liquidity: '500',
    imageA: '/planq.jpg',
    imageB: '/planq.jpg'
  }
];

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

function Pools() {
  return (
    <div className="min-h-screen bg-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">Available Pools</h1>

      <div className="flex justify-center mb-12">
        <div className="bg-glossy-black p-6 rounded-lg shadow-lg w-full max-w-6xl"> {/* Adjusted max-width */}
          {pools.length === 0 ? (
            <p className="text-white text-center">No pools available</p>
          ) : (
            <ul className="space-y-4">
              {pools.map((pool) => (
                <li key={pool.id} className="p-6 rounded-lg border border-white bg-transparent flex items-center justify-between"> {/* Transparent background and white border */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <img src={pool.imageA} alt={pool.tokenA} className="w-12 h-12 mr-3" />
                      <span className="text-white font-bold">{pool.tokenA}</span>
                    </div>
                    <span className="text-gray-400 mx-2">-</span>
                    <div className="flex items-center">
                      <img src={pool.imageB} alt={pool.tokenB} className="w-12 h-12 mr-3" />
                      <span className="text-white font-bold">{pool.tokenB}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-right"> {/* Right-aligned text */}
                    <p className="text-white">Liquidity: {pool.liquidity} tokens</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pools;
