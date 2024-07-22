import { ethers } from 'ethers';

// Function to connect to MetaMask
export const connectMetaMask = async () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    // Create a Web3Provider instance for MetaMask
    const provider = new ethers.BrowserProvider((window as any).ethereum);

    try {
      // Request accounts from MetaMask
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await provider.getSigner();
     // console.log(signer)
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
