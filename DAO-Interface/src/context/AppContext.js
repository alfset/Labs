import React, { createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [networkProvider, setNetworkProvider] = useState(null);

    useEffect(() => {
        const ethereum = window.ethereum;
    
        if (!ethereum) {
            console.log("Make sure you have MetaMask!");
            return;
        }
    
        const checkIfWalletIsConnected = async () => {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
            }
    
            const provider = new ethers.providers.Web3Provider(ethereum);
            setNetworkProvider(provider);
        };
    
        checkIfWalletIsConnected();
    
        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                console.log("Please connect to MetaMask.");
            } else {
                setCurrentAccount(accounts[0]);
            }
        };
    
        const handleChainChanged = (_chainId) => {
            // Reload the page to reset the DApp state with the new chain's data
            window.location.reload();
        };
    
        if (ethereum.on) {
            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('chainChanged', handleChainChanged);
        }
    
        return () => {
            if (ethereum.removeListener) {
                ethereum.removeListener('accountsChanged', handleAccountsChanged);
                ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, []);
    
    return (
        <AppContext.Provider value={{ currentAccount, networkProvider }}>
            {children}
        </AppContext.Provider>
    );
};
