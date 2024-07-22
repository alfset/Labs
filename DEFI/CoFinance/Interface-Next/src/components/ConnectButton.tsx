'use client';
import React from 'react';
import { ethers } from 'ethers';
import AccountModal from './AccountModal';
import { Button } from '../components/ui/moving-border'

interface ConnectButtonProps {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ account, setAccount }) => {
  const [connected, setConnected] = React.useState<boolean>(!!account);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const handleConnectWallet = async () => {
    try {
      if ((window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await (await signer).getAddress();
        console.log(address)
        setAccount(address);
        setConnected(true);
      } else {
        console.error("No Ethereum provider detected");
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  const handleDisconnectWallet = () => {
    setAccount(null);
    setConnected(false);
  };

  return (
    <>
      <Button
        onClick={connected ? handleDisconnectWallet : handleConnectWallet}
      >
        {connected ? `Disconnect` : `Connect Wallet`}
      </Button>
      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        account={account}
        setAccount={setAccount}
      />
    </>
  );
};

export default ConnectButton;
