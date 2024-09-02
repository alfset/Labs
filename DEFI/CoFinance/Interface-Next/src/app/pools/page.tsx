'use client';
import React, { useState, useEffect } from 'react';
import PoolCard from '../../components/PoolCard';
import { Button } from '../../components/ui/moving-border';
import { ethers } from 'ethers';

// Replace these with actual values
const COFINANCE_FACTORY_ADDRESS = '0xf2dAfc6dC12B8D6770C413bA38196B4f67EB7578';
const COFINANCE_FACTORY_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newFee",
				"type": "uint256"
			}
		],
		"name": "CreationFeeUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "poolAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FeeReceived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FeesWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "poolAddress",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenA",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenB",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "liquidityTokenAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "rewardToken",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "priceFeed",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "stakingContract",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isPoolIncentivized",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "factory",
				"type": "address"
			}
		],
		"name": "PoolCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allPools",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenA",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenB",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "rewardToken",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "priceFeed",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "liquidityTokenName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "liquidityTokenSymbol",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isPoolIncentivized",
				"type": "bool"
			}
		],
		"name": "createPool",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "creationFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllPools",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getIncentivizedPools",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenA",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenB",
				"type": "address"
			}
		],
		"name": "getPoolByPair",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "getPoolByToken",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "incentivizedPools",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxFeePercent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "poolByPair",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "pools",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "poolsByToken",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "receiveFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalFeesReceived",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newFee",
				"type": "uint256"
			}
		],
		"name": "updateCreationFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "withdrawFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

function Pools() {
  const [pools, setPools] = useState([]);
  const [userOwnedPools, setUserOwnedPools] = useState([]);
  
  useEffect(() => {
    const fetchPools = async () => {
      try {
        if (!window.ethereum) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const coFinanceFactory = new ethers.Contract(COFINANCE_FACTORY_ADDRESS, COFINANCE_FACTORY_ABI, provider);
        const poolData = await coFinanceFactory.getAllPools();
        console.log(poolData)
        const userOwned = await coFinanceFactory.getIncentivizedPools();
        console.log(userOwned)
        setPools(poolData);
        setUserOwnedPools(userOwned);
      } catch (error) {
        console.error('Error fetching pools:', error);
      }
    };

    fetchPools();
  }, []);

  const handleAddPoolClick = () => {
    window.location.href = '/addpools';
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-36">
      {userOwnedPools.length > 0 && (
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-lg md:text-4xl font-sans font-bold mb-6 text-white">Incentive-Pools</h2>
          
          <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-6xl backdrop-blur-sm">
            <button
              onClick={handleAddPoolClick}
              className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Add New Pool
            </button>
            <ul className="space-y-4">
              {userOwnedPools.map((pool, index) => (
                <PoolCard key={index} pool={pool} />
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
              {pools.map((pool, index) => (
                <PoolCard key={index} pool={pool} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pools;
