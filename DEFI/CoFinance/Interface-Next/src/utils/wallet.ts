// utils/wallet.ts
import { ethers } from 'ethers';

export const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      return address;
    } catch (error) {
      console.error('User denied account access', error);
      return null;
    }
  } else {
    console.error('No Ethereum provider found');
    return null;
  }
};
