// src/components/DAO.js
import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { AppContext } from '../context/AppContext';
import LiquidityTokenABI from '../utils/abis/CoFinacne.json'; // Adjust path if necessary
import CoFinanceABI from '../utils/abis/CoFinacne.json'; // Adjust path if necessary

const contractAddress = '0x8Dcb1F18ccFFb31725638C4EDDe570c4a1df1Da3'; // Replace with the CoFinance contract address

const DAO = () => {
    const { currentAccount, networkProvider } = useContext(AppContext);
    const [coFinanceContract, setCoFinanceContract] = useState(null);
    const [liquidityTokenContract, setLiquidityTokenContract] = useState(null);
    const [stakedAmount, setStakedAmount] = useState('0');
    const [additionalStake, setAdditionalStake] = useState('');

    useEffect(() => {
        if (networkProvider && currentAccount) {
            const signer = networkProvider.getSigner();
            const coFinance = new ethers.Contract(contractAddress, CoFinanceABI, signer);
            const liquidityToken = new ethers.Contract(contractAddress, LiquidityTokenABI, signer);

            setCoFinanceContract(coFinance);
            setLiquidityTokenContract(liquidityToken);

            fetchStakedAmount(coFinance, currentAccount);
        }
    }, [networkProvider, currentAccount]);

    const fetchStakedAmount = async (contract, account) => {
        try {
            const amount = await contract.stakes(account);
            setStakedAmount(ethers.utils.formatEther(amount));
        } catch (error) {
            console.error('Failed to fetch staked amount:', error);
        }
    };

    const joinDAO = async () => {
        if (!coFinanceContract) return;

        try {
            const txResponse = await coFinanceContract.stakeTokens(ethers.utils.parseEther("10"), 0); // Adjust parameters as per your contract
            await txResponse.wait();
            alert('Successfully joined DAO!');
            fetchStakedAmount(coFinanceContract, currentAccount);
        } catch (error) {
            console.error('Failed to join DAO:', error);
            alert('Error joining DAO');
        }
    };

    const addStake = async () => {
        if (!coFinanceContract || !additionalStake) return;

        try {
            const txResponse = await coFinanceContract.stakeTokens(ethers.utils.parseEther(additionalStake), 0); // Adjust parameters as per your contract
            await txResponse.wait();
            alert('Successfully added stake!');
            fetchStakedAmount(coFinanceContract, currentAccount);
            setAdditionalStake('');
        } catch (error) {
            console.error('Failed to add stake:', error);
            alert('Error adding stake');
        }
    };

    return (
        <div>
            <h1>DAO</h1>
            <p>Staked Amount: {stakedAmount} ETH</p>
            <button onClick={joinDAO}>Join DAO</button>
            <div>
                <input
                    type="text"
                    value={additionalStake}
                    onChange={e => setAdditionalStake(e.target.value)}
                    placeholder="Amount to stake (ETH)"
                />
                <button onClick={addStake}>Add Stake</button>
            </div>
        </div>
    );
};

export default DAO;
