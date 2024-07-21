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
  // Add more pools as needed
];

// Dummy token holder data with images
const tokenHolders = [
  {
    id: '1',
    name: 'Holder One',
    tokens: '2000',
    image: '/holder1.jpg', // Add the image path
  },
  {
    id: '2',
    name: 'Holder Two',
    tokens: '1500',
    image: '/holder2.jpg', // Add the image path
  },
  {
    id: '3',
    name: 'Holder Three',
    tokens: '3000',
    image: '/holder3.jpg', // Add the image path
  },
  // Add more holders as needed
];

// Dummy staking token data
const stakingTokens = [
  {
    id: '1',
    tokenName: 'Staked Token A',
    amount: '500',
    image: '/staking-token-a.jpg', // Add the image path
  },
  {
    id: '2',
    tokenName: 'Staked Token B',
    amount: '300',
    image: '/staking-token-b.jpg', // Add the image path
  },
  // Add more staking tokens as needed
];

// Calculate total liquidity
const totalLiquidity = pools.reduce((total, pool) => total + parseFloat(pool.liquidity), 0);

// Dummy data for staked pools, borrowed amount, and staking assets
const stakedPools = 1600;
const borrowedAmount = 1000;
const stakingAssets = 1200;

function Portofolio() {
  return (
    <div className="min-h-screen bg-black py-12 pt-24">
      {/* Portfolio Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-7xl font-sans font-bold mb-8 text-white pb-2">
         
        </h1>
        <div className="bg-transparent rounded-lg shadow-lg w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-4"> Portfolio Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-transparent border border-transparent p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-white mb-2">Total Assets</h3>
              <p className="text-lg text-white">Total Liquidity: {totalLiquidity.toFixed(2)} tokens</p>
            </div>
            <div className="bg-transparent border border-transparent p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-white mb-2">Staked Pools</h3>
              <p className="text-lg text-white">${stakedPools.toFixed(2)}</p>
            </div>
            <div className="bg-transparent border border-transparent p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-white mb-2">Borrowed Amount</h3>
              <p className="text-lg text-white">${borrowedAmount.toFixed(2)}</p>
            </div>
            <div className="bg-transparent border border-transparent p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-white mb-2">Staking Assets</h3>
              <p className="text-lg text-white">${stakingAssets.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pools Section */}
      <div className="flex justify-center mb-12">
        <div className="bg-transparent border border-transparent p-6 rounded-lg shadow-lg w-full max-w-6xl">
          {pools.length === 0 ? (
            <p className="text-white text-center">No pools available</p>
          ) : (
            <ul className="space-y-4">
              {pools.map((pool) => (
                <li key={pool.id} className="p-6 rounded-lg border border-transparent bg-transparent hover:bg-gray-800 transition duration-300 ease-in-out flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <img src={pool.imageA} alt={pool.tokenA} className="w-12 h-12 mr-3 rounded-full border border-transparent" />
                      <span className="text-white font-bold">{pool.tokenA}</span>
                    </div>
                    <span className="text-gray-400 mx-2">-</span>
                    <div className="flex items-center">
                      <img src={pool.imageB} alt={pool.tokenB} className="w-12 h-12 mr-3 rounded-full border border-transparent" />
                      <span className="text-white font-bold">{pool.tokenB}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-white">Liquidity: {pool.liquidity} tokens</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Token Holders Section */}
      <div className="flex justify-center mb-12">
        <div className="bg-transparent border border-transparent p-6 rounded-lg shadow-lg w-full max-w-6xl">
          <h2 className="text-2xl font-semibold text-white mb-4">Token Holders</h2>
          {tokenHolders.length === 0 ? (
            <p className="text-white text-center">No token holders available</p>
          ) : (
            <ul className="space-y-4">
              {tokenHolders.map((holder) => (
                <li key={holder.id} className="p-6 rounded-lg border border-transparent bg-transparent hover:bg-gray-800 transition duration-300 ease-in-out flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={holder.image} alt={holder.name} className="w-12 h-12 mr-3 rounded-full border border-transparent" />
                    <span className="text-white font-bold">{holder.name}</span>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-white">Tokens: {holder.tokens}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Staking Tokens Section */}
      <div className="flex justify-center">
        <div className="bg-transparent border border-transparent p-6 rounded-lg shadow-lg w-full max-w-6xl">
          <h2 className="text-2xl font-semibold text-white mb-4">Staking Tokens</h2>
          {stakingTokens.length === 0 ? (
            <p className="text-white text-center">No staking tokens available</p>
          ) : (
            <ul className="space-y-4">
              {stakingTokens.map((token) => (
                <li key={token.id} className="p-6 rounded-lg border border-transparent bg-transparent hover:bg-gray-800 transition duration-300 ease-in-out flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={token.image} alt={token.tokenName} className="w-12 h-12 mr-3 rounded-full border border-transparent" />
                    <span className="text-white font-bold">{token.tokenName}</span>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-white">Amount: {token.amount}</p>
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

export default Portofolio;
