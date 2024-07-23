'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/moving-border';
import { SigningStargateClient } from '@cosmjs/stargate';
import validatorsData from '../../data/validator.json'; // Adjust the path to where your validators.json is located

interface Validator {
  operator_address: string;
  moniker: string;
  tokens?: string;
  network?: string; // Add network to the Validator interface
}

function TokenStake() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [client, setClient] = useState<SigningStargateClient | null>(null);
  const [account, setAccount] = useState<any>(null);
  const [validators, setValidators] = useState<Validator[]>(validatorsData.tokens); 
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [showPopup, setShowPopup] = useState(false); // State for handling pop-up visibility
  const [txHash, setTxHash] = useState<string | null>(null); // State for handling transaction hash

  useEffect(() => {
    const fetchBalance = async () => {
      if (client && account) {
        try {
          const accountBalance = await client.getBalance(account.address, 'uosmo');
          setBalance(accountBalance.amount);
        } catch (err) {
          setError(`Failed to fetch balance: ${err.message}`);
        }
      }
    };
    fetchBalance();
  }, [client, account]);

  const connectWallet = async () => {
    if (!window.getOfflineSigner || !window.getOfflineSigner("osmo-test-5")) {
      setError("Keplr Wallet is not installed or not available");
      return;
    }

    try {
      const offlineSigner = window.getOfflineSigner("osmo-test-5");
      const client = await SigningStargateClient.connectWithSigner(
        "https://rpc.testnet.osmosis.zone",
        offlineSigner
      );
      setClient(client);

      const accounts = await offlineSigner.getAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setWalletConnected(true);
      } else {
        setError("No accounts found");
      }
    } catch (err) {
      setError(`Failed to connect wallet: ${err.message}`);
    }
  };

  const handleStake = async () => {
    if (!client || !account || !selectedValidator) return;
  
    try {
      const amountToStake = parseFloat(stakeAmount);
      if (isNaN(amountToStake) || amountToStake <= 0) {
        setError("Invalid stake amount");
        return;
      }
      const fee = { amount: [{ denom: 'uosmo', amount: '3000' }], gas: '300000' }; // Example fee
      const stakingAmount = [{ denom: 'uosmo', amount: amountToStake.toString() }];
      const tx = await client.signAndBroadcast(
        account.address,
        [
          {
            typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
            value: {
              delegatorAddress: account.address,
              validatorAddress: selectedValidator.operator_address,
              amount: stakingAmount[0],
            },
          },
        ],
        fee,
        ''
      );  
      if (tx.code !== 0) {
        setError(`Transaction failed: ${tx.log || tx.rawLog}`);
        setTxHash(null);
      } else {
        setTxHash(tx.transactionHash || 'Transaction hash not available');
        setShowPopup(false);
      }
    } catch (err) {
      setError(`Failed to stake tokens: ${err.message}`);
      setTxHash(null);
    }
  };
  

  const handleSelectValidator = (validator: Validator) => {
    setSelectedValidator(validator);
    setStakeAmount('');
    setShowPopup(true); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black py-12 pt-24">
      {/* Wallet Connection */}
      <div className="text-center mb-12">
        <Button
          onClick={connectWallet}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition duration-300 text-white py-2 px-4 rounded-lg"
        >
          {walletConnected ? `Connected` : 'Connect Keplr Wallet'}
        </Button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* Account Card */}
      {walletConnected && account && (
        <div className="flex justify-center mb-12">
          <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black border border-gray-600 p-6 rounded-lg shadow-lg w-full max-w-6xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white mb-4">Account Details</h2>
            <div className="space-y-4">
              <p className="text-white font-bold">Address: {account.address}</p>
              <p className="text-white font-bold">Balance: {balance ? `${balance} osmo` : 'Loading...'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Validators Section */}
      <div className="flex justify-center mb-12">
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black border border-gray-600 p-6 rounded-lg shadow-lg w-full max-w-6xl backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-white mb-4">Validators</h2>
          {validators.length === 0 ? (
            <p className="text-white text-center">No validators available</p>
          ) : (
            <ul className="space-y-4">
              {validators.map((validator) => (
                <li
                  key={validator.operator_address}
                  className="p-6 rounded-lg border border-gray-600 bg-gray-700 hover:bg-gray-600 transition duration-300 ease-in-out flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-bold">{validator.moniker || 'Unknown Validator'}</span>
                    <span className="text-gray-400">({validator.name || 'Unknown Network'})</span>
                  </div>
                  <div className="space-y-2 text-right flex items-center">
                    <Button
                      onClick={() => handleSelectValidator(validator)}
                      className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition duration-300 text-white py-2 px-4 rounded-lg"

                    >
                      Select
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Stake Section */}
      {showPopup && selectedValidator && (
        <div className="fixed top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-800 via-gray-900 to-black border border-gray-600 p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-2xl font-semibold text-white mb-4">Stake Tokens</h2>
          <p className="text-white mb-4">Selected Validator: {selectedValidator.moniker || 'Unknown Validator'}</p>
          <p className="text-gray-400 mb-4">Network: {selectedValidator.name || 'Unknown Network'}</p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Amount to Stake"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="p-2 rounded-lg border text-black border-gray-600 w-full"
            />
            <Button
              onClick={handleStake}
              className="bg-blue-500 text-black px-4 py-2 rounded-lg"
            >
              Stake
            </Button>
            <Button
              onClick={() => setShowPopup(false)}
              className="bg-red-500 text-black px-4 py-2 rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Transaction Hash Notification */}
      {txHash && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <p>Transaction successful! Hash:</p>
          <a 
            href={`https://www.mintscan.io/osmosis-testnet/tx/${txHash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-200 underline"
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
}

export default TokenStake;
