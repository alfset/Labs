// components/ChainSwitchButton.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '../components/ui/moving-border';
import { switchChain } from '../utils/wallet'; 

// Define the chain options
const chains = [
  { value: '0x1', label: 'Ethereum' }, 
  { value: '0x1a', label: 'Swisstronik' },
  { value: '0x3', label: 'Cardano' },
  { value: '0x4', label: 'Solana' }, 
  { value: '0x5', label: 'BSC' }, 
  { value: '0x6', label: 'Planq' }, 
  { value: '0x7', label: 'Orichain' },
  { value: '0x8', label: 'Scroll' },
  { value: '0x9', label: 'Base' },
  { value: '0x10', label: 'Cross Finance' },
  { value: '0x11', label: 'Polygon' },


];

const ChainSwitchButton: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleSwitchChain = async (chainId: string) => {
    try {
      await switchChain(chainId);
      setSelectedChain(chainId);
      setMenuOpen(false); // Close the menu after switching
      console.log(`Switched to chain ID: ${chainId}`);
    } catch (err) {
      console.error("Failed to switch chain:", err);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <Button
        className="mr-2"
        onClick={() => setMenuOpen(prev => !prev)} // Toggle menu visibility
      >
        {selectedChain ? chains.find(chain => chain.value === selectedChain)?.label : 'Select Chain'}
      </Button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white border border-gray-600 rounded-md shadow-lg">
          {chains.map((chain) => (
            <button
              key={chain.value}
              onClick={() => handleSwitchChain(chain.value)}
              className="block w-full px-4 py-2 text-left hover:bg-gray-700"
            >
              {chain.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChainSwitchButton;
