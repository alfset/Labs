// src/components/DAO.js
import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { AppContext } from '../context/AppContext';
import OracleABI from '../utils/abis/Oralce_ABI.json';  // Correct the path if necessary

const contractAddress = '0x7b4c331cC2CB5D638D3c3c8145DE2BE9C276e7ca';

const DAO = () => {
    const { currentAccount, networkProvider } = useContext(AppContext);
    const [daoContract, setDaoContract] = useState(null);
    const [stakedAmount, setStakedAmount] = useState('0');
    const [additionalStake, setAdditionalStake] = useState('');

    useEffect(() => {
        if (networkProvider && currentAccount) {
            const signer = networkProvider.getSigner();
            const contract = new ethers.Contract(contractAddress, OracleABI, signer);
            setDaoContract(contract);
            fetchStakedAmount(contract, currentAccount);
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
        if (!daoContract) return;

        try {
            const txResponse = await daoContract.joinDAO({ value: ethers.utils.parseEther("10") });
            await txResponse.wait();
            alert('Successfully joined DAO!');
            fetchStakedAmount(daoContract, currentAccount);
        } catch (error) {
            console.error('Failed to join DAO:', error);
            alert('Error joining DAO');
        }
    };

    const addStake = async () => {
        if (!daoContract || !additionalStake) return;

        try {
            const txResponse = await daoContract.addStake({ value: ethers.utils.parseEther(additionalStake) });
            await txResponse.wait();
            alert('Successfully added stake!');
            fetchStakedAmount(daoContract, currentAccount);
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
