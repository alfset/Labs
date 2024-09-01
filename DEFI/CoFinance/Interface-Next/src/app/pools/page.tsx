'use client';
import React from 'react';
import PoolCard from '../../components/PoolCard'; 
import { Button } from '../../components/ui/moving-border';
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
  // Additional pools...
];

// Dummy user-owned pool data
const userOwnedPools = [
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
  }
];

function Pools() {
  const handleAddPoolClick = () => {
    window.location.href = '/add-pools'; 
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-36">
      {userOwnedPools.length > 0 && (
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-lg md:text-4xl font-sans font-bold mb-6 text-white"> Pools</h2>
          
          <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-6xl backdrop-blur-sm">
          <button
              onClick={handleAddPoolClick}
              className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Add New Pool
            </button>
            <ul className="space-y-4">
              {userOwnedPools.map((pool) => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </ul>
            
          </div>
        </div>
      )}
      <div className="flex flex-col items-center">
        <p className="text-center text-white text-lg mb-12 max-w-4xl mx-auto px-4">
          Discover Pools
        </p>
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-6xl backdrop-blur-sm">
          {pools.length === 0 ? (
            <p className="text-white text-center">No pools available</p>
          ) : (
            <ul className="space-y-4">
              {pools.map((pool) => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pools;
