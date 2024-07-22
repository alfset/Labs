'use client'; // Ensure this file is treated as a client component

import React from 'react';
import { Button } from '../components/ui/moving-border';
import { connectMetaMask } from '../utils/wallet'; // Update path as necessary

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
    <Button
      onClick={connected ? handleDisconnectWallet : handleConnectMetaMask}
    >
      {connected ? `${account?.substring(0, 6)}...${account?.substring(account.length - 4)}` : 'Connect Wallet'}
    </Button>
  );
};

export default ConnectButton;
