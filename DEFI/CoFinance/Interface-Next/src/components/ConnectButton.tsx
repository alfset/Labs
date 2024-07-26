'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/moving-border';
import ChainSwitchButton from './SwitchChain'; // Correct import path
import { connectMetaMask, disconnectMetaMask } from '../utils/wallet'; // Correct import path
import { connectNamiWallet } from '../utils/cardano'; // Correct import path

const ConnectButton: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(!!account);
  const [visible, setVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    setConnected(!!account);
  }, [account]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      if (scrollTop > lastScrollTop) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }

      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  const handleConnectMetaMask = async () => {
    try {
      const address = await connectMetaMask();
      if (typeof address === 'string') {
        console.log(`MetaMask connected: ${address}`);
        setAccount(address);
        setConnected(true);
      } else {
        console.error("Failed to connect MetaMask. Address is not a string.");
      }
    } catch (err) {
      console.error("Failed to connect MetaMask:", err);
    }
  };

  const handleConnectNami = async () => {
    try {
      const address = await connectNamiWallet();
      if (typeof address === 'string') {
        console.log(`Nami Wallet connected: ${address}`);
        setAccount(address);
        setConnected(true);
      } else {
        console.error("Failed to connect Nami Wallet. Address is not a string:", address);
      }
    } catch (err) {
      console.error("Failed to connect Nami Wallet:", err);
    }
  };

  const handleDisconnectWallet = () => {
    setAccount(null);
    setConnected(false);
  };

  const handleConnect = async () => {
    console.log(`Attempting to connect with selected chain: ${selectedChain}`); // Debugging
    if (selectedChain === 'cardano') {
      await handleConnectNami();
    } else {
      await handleConnectMetaMask();
    }
  };

  const accountDisplay = account && typeof account === 'string'
    ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
    : 'Connect Wallet';

  return (
    <div
      className={`fixed top-10 right-4 z-50 transition-transform ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center space-x-4">
        <ChainSwitchButton setSelectedChain={setSelectedChain} />
        <Button onClick={connected ? handleDisconnectWallet : handleConnect}>
          {connected ? accountDisplay : 'Connect Wallet'}
        </Button>
      </div>
    </div>
  );
};

export default ConnectButton;
