import { ethers } from 'ethers';

// Create a provider
const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  } else {
    console.error('MetaMask is not installed.');
    return null;
  }
};

export const connectWallet = async () => {
  const provider = getProvider();
  if (!provider) return null;

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return address;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    return null;
  }
};
