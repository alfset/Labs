import React, { useState } from 'react';
import { Button } from '../components/ui/moving-border'; // Ensure this path is correct
import { switchChainEthereum, switchChainCardano, switchChainSolana } from '../utils/wallet'; // Import your functions

// Define the chain options, including Cardano and Solana
const chains = [
  { value: '0x1', label: 'Ethereum' },
  { value: '0x50b', label: 'Swisstronik' },
  { value: '0x38', label: 'BSC' },
  { value: '0x1ba5', label: 'Planq' },
  { value: '0x67266a7', label: 'Orichain' },
  { value: '0x8274f', label: 'Scroll' },
  { value: '0x2105', label: 'Base' },
  { value: '0x103d', label: 'Cross Finance' },
  { value: '0x89', label: 'Polygon' },
  { value: 'cardano', label: 'Cardano' },
  { value: 'solana', label: 'Solana' },
];

interface ChainSwitchButtonProps {
  setSelectedChain: React.Dispatch<React.SetStateAction<string>>;
}

const ChainSwitchButton: React.FC<ChainSwitchButtonProps> = ({ setSelectedChain }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [selectedChain, setSelectedChainLocal] = useState<string>('');

  const handleSwitchChain = async (chainId: string) => {
    console.log(`Switching to chain ID: ${chainId}`); // Debugging
    try {
      if (chainId === 'solana') {
        console.log(`Selected Solana, switching Solana cluster.`);
        await switchChainSolana(); // Handle Solana chain switch
        setSelectedChainLocal(chainId);
        setSelectedChain(chainId);
        setMenuOpen(false);
      } else if (chainId === 'cardano') {
        console.log(`Selected Cardano.`);
        await switchChainCardano(); // Handle Cardano chain switch
        setSelectedChainLocal(chainId);
        setSelectedChain(chainId);
        setMenuOpen(false);
      } else {
        await switchChainEthereum(chainId); // Handle Ethereum chain switch
        setSelectedChainLocal(chainId);
        setSelectedChain(chainId);
        setMenuOpen(false);
        console.log(`Switched to chain ID: ${chainId}`);
      }
    } catch (err) {
      console.error("Failed to switch chain:", err);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <Button
        className="mr-2"
        onClick={() => setMenuOpen(prev => !prev)}
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
