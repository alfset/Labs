export const connectMetaMask = async (): Promise<string | null> => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0] || null;
    } catch (error) {
      console.error('User rejected the request:', error);
      throw new Error('User rejected the request');
    }
  } else {
    console.error('MetaMask is not installed');
    throw new Error('MetaMask is not installed');
  }
};

// Switches to a specified Ethereum network chain ID
export const switchChain = async (chainId: string): Promise<void> => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error) {
      // Handle errors such as user rejecting the switch or the chain not being available
      if (error.code === 4902) {
        console.error('Chain not found. Please add the chain to MetaMask.');
      } else {
        console.error("Error switching chains:", error);
      }
    }
  } else {
    console.error("MetaMask is not installed.");
    throw new Error("MetaMask is not installed.");
  }
};

export const signMessage = async (message: string): Promise<string> => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner(account);
      
      const signature = await signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw new Error('Error signing message');
    }
  } else {
    console.error('MetaMask is not installed');
    throw new Error('MetaMask is not installed');
  }
};

export const switchChainEthereum = async (chainId: string): Promise<void> => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        console.error('Chain not found. Please add the chain to MetaMask.');
      } else {
        console.error("Error switching chains:", error);
      }
    }
  } else {
    console.error("MetaMask is not installed.");
    throw new Error("MetaMask is not installed.");
  }
};

export const connectFlintWallet = async (): Promise<string | null> => {
  try {
    const flint = window.cardano?.flint;
    if (!flint) {
      console.error("Flint Wallet not found.");
      return null;
    }

    const accounts = await flint.enable();
    console.log("Flint Wallet accounts:", accounts); // Debugging

    const address = accounts[0];
    if (typeof address === 'string') {
      return address;
    } else {
      console.error("Flint Wallet address is not a string:", address);
      return null;
    }
  } catch (error) {
    console.error("Failed to connect Flint Wallet:", error);
    return null;
  }
};


// For Cardano chain switching
// utils/wallet.ts

// utils/wallet.ts

export const switchChainCardano = async () => {
  // Example logic for switching Cardano chains
  if (window.cardano && window.cardano.flint) {
    try {
      const wallet = window.cardano.flint;
      // Use wallet API to switch chains
    } catch (error) {
      console.error('Failed to switch Cardano chain:', error);
      throw error;
    }
  } else {
    console.error('Flint Wallet not found.');
    throw new Error('Flint Wallet not found. Please install a supported wallet.');
  }
};



// For Solana chain switching
export const switchChainSolana = async (): Promise<void> => {
  if (window.solana) {
    try {
      // Solana wallet switching is generally managed by the wallet's UI or configuration
      console.log('Switched to Solana network.');
    } catch (error) {
      console.error("Error switching to Solana:", error);
      throw new Error("Failed to switch to Solana network");
    }
  } else {
    console.error("Solana wallet not found. Please install it.");
    throw new Error("Solana wallet is not installed.");
  }
};




