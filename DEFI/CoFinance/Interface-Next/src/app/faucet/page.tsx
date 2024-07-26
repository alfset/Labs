'use client'; // Ensure this file is treated as a client-side component

import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/moving-border';
import { ethers } from 'ethers';
import TokenERC20ABI from '../../data/abis/ERC20.json'; // Import ABI
import { useAccount } from '../rootLayout'; // Import the useAccount hook
import contractAddressesJson from '../../data/tokens.json'; // Import JSON data
import { ContractAddresses } from '../../types/ContractAddress'; // Import TypeScript type

const Faucet: React.FC = () => {
  const { account } = useAccount(); // Use account from context
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [contractAddresses, setContractAddresses] = useState<ContractAddresses | null>(null);

  useEffect(() => {
    // Directly use the imported JSON data
    setContractAddresses(contractAddressesJson);
  }, []);

  const promptMetaMaskSign = async (message: string): Promise<string> => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    // Initialize provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Request MetaMask to sign the message
    const signature = await signer.signMessage(message);

    return signature;
  };

  const handleRequestFaucet = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const message = `Please sign this message to request faucet. Account: ${account}`;

    try {
      // Prompt MetaMask to sign the message
      await promptMetaMaskSign(message);

      // Initialize provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const chainId = await provider.getNetwork().then(network => network.chainId);

      // Determine the correct contract addresses based on chain ID
      if (!contractAddresses) {
        throw new Error('Contract addresses not loaded');
      }

      const addresses = contractAddresses[chainId];

      if (!addresses || addresses.length === 0) {
        throw new Error('No contract addresses for the current chain ID');
      }

      // Initialize signer
      const signer = await provider.getSigner();

      // Track transaction hashes
      const txHashes: string[] = [];

      // Loop through each contract address and call the mint function
      for (const address of addresses) {
        const contract = new ethers.Contract(address, TokenERC20ABI, signer);
        const mint100TokensTx = await contract.mint100tokens();
        await mint100TokensTx.wait();
        txHashes.push(mint100TokensTx.hash);
      }

      setSuccess(`Transactions successful! Tx Hashes: ${txHashes.join(', ')}`);
    } catch (error) {
      setError(`Failed to request faucet: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">Request Faucet</h1>

      <div className="flex justify-center mb-12">
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg w-full max-w-screen-lg">
          <div className="flex items-center justify-between w-full p-4">
            <span className="text-white mr-4 truncate">{account ? `Connected: ${account}` : 'Not connected'}</span>
            <Button
              onClick={handleRequestFaucet}
              className={`bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition duration-300 text-white py-2 px-4 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Request Faucet'}
            </Button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
        </div>
      </div>
    </div>
  );
}

export default Faucet;
