import { ethers } from 'ethers';
import OracleABI from '../abis/Oralce_ABI.json';

export const listenToPriceUpdates = (contractAddress, provider, setPriceUpdate) => {
    const contract = new ethers.Contract(contractAddress, OracleABI, provider);

    contract.on('PriceUpdated', (priceId, price) => {
        console.log(`Price Updated: ${priceId} to ${ethers.utils.formatEther(price)}`);
        setPriceUpdate({ priceId: priceId, price: ethers.utils.formatEther(price) });
    });

    return () => {
        contract.removeAllListeners('PriceUpdated');
    };
};
