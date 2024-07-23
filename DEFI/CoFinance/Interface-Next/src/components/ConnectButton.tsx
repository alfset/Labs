'use client';

import React from 'react';
import { Button } from '../components/ui/moving-border'; // Adjust this import based on your project structure
import ChainSwitchButton from './SwitchChain';
import { connectMetaMask } from '../utils/wallet';

interface ConnectButtonProps {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ account, setAccount }) => {
  const [connected, setConnected] = React.useState<boolean>(!!account);

  React.useEffect(() => {
    setConnected(!!account);
  }, [account]);

  const handleConnectMetaMask = async () => {
    try {
      const address = await connectMetaMask();
      if (address) {
        console.log(address);
        setAccount(address);
        setConnected(true);
      } else {
        console.error("Failed to connect MetaMask.");
      }
    } catch (err) {
      console.error("Failed to connect MetaMask:", err);
    }
  };

  const handleDisconnectWallet = () => {
    setAccount(null);
    setConnected(false);
  };

  return (
    <div className="flex items-center">
      <ChainSwitchButton />
      <Button onClick={connected ? handleDisconnectWallet : handleConnectMetaMask}>
        {connected ? `${account?.substring(0, 6)}...${account?.substring(account.length - 4)}` : 'Connect Wallet'}
      </Button>
    </div>
  );
};

export default ConnectButton;
