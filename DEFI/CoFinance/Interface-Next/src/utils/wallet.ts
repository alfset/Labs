import { ethers } from 'ethers';

export const connectMetaMask = async () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    const provider = new ethers.BrowserProvider((window as any).ethereum);

    try {
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log(address);
      return address;
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      return null;
    }
  } else {
    console.error('MetaMask is not installed.');
    return null;
  }
};

export const switchChain = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Example chain ID (Ethereum Mainnet)
      });
    } catch (error) {
      console.error("Error switching chains:", error);
    }
  } else {
    console.error("Ethereum provider is not available.");
  }
};
