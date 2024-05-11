import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected, walletconnect } from './connector';

const ConnectWallet = () => {
  const { activate, deactivate, active, account } = useWeb3React();

  const connectInjected = async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.error(ex);
    }
  };

  const connectWalletConnect = async () => {
    try {
      await activate(walletconnect);
    } catch (ex) {
      console.error(ex);
    }
  };

  const disconnect = () => {
    try {
      deactivate();
    } catch (ex) {
      console.error(ex);
    }
  };

  return (
    <div>
      <button onClick={connectInjected}>Connect MetaMask</button>
      <button onClick={connectWalletConnect}>Connect WalletConnect</button>
      <button onClick={disconnect}>Disconnect</button>
      {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
    </div>
  );
};

export default ConnectWallet;
