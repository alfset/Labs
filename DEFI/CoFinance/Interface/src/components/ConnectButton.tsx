import React from "react";
import { Button } from "@chakra-ui/react";
import { ethers } from "ethers";

interface ConnectButtonProps {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  onConnect: () => void;  // Added prop to notify parent about connection
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ account, setAccount, onConnect }) => {
  const [connected, setConnected] = React.useState<boolean>(!!account);

  const handleConnectWallet = async () => {
    try {
      if ((window as any).ethereum) {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setConnected(true);
        onConnect();  // Notify parent about successful connection
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
    <Button
      colorScheme="teal"
      onClick={connected ? handleDisconnectWallet : handleConnectWallet}
    >
      {connected ? `Disconnect` : `Connect Wallet`}
    </Button>
  );
};

export default ConnectButton;
