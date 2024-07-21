import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const POLLING_INTERVAL = 12000;

// Define RPC URLs for different networks
const RPC_URLS = {
  84532: 'https://sepolia.base.org',    
  97: 'https://bsc-testnet-rpc.publicnode.com',            
  534351: 'https://scroll-testnet.rpc.grove.city/v1/a7a7c8e2',
  4157: 'https://rpc.testnet.ms'   
};

export const injected = new InjectedConnector({
  supportedChainIds: [ 84532, 97, 534351, 4157]
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 
    84532: RPC_URLS[84532], 
    97: RPC_URLS[97],
    534351: RPC_URLS[534351],
    4157: RPC_URLS[4157]
  }, 
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
});
