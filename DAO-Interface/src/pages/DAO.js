import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { AppContext } from '../context/AppContext';
import OracleABI from '../utils/abis/CoFinacne.json';
import { contractAddresses, tickers } from '../utils/chain-contants';

const DAO = () => {
    const { currentAccount, networkProvider } = useContext(AppContext);
    const [daoContract, setDaoContract] = useState(null);
    const [chainId, setChainId] = useState('');
    const [stakedAmount, setStakedAmount] = useState('0');
    const [members, setMembers] = useState([]);
    const [additionalStake, setAdditionalStake] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');

    useEffect(() => {
        if (networkProvider) {
            networkProvider.getNetwork().then((network) => {
                const hexChainId = network.chainId.toString(16);
                setChainId(hexChainId);

                const contractAddress = contractAddresses[hexChainId];
                if (contractAddress && currentAccount) {
                    const signer = networkProvider.getSigner();
                    const contract = new ethers.Contract(contractAddress, OracleABI, signer);
                    setDaoContract(contract);
                    fetchStakedAmount(contract, currentAccount);
                    fetchMembers(contract);
                }
            });
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

    const fetchMembers = async (contract) => {
        const memberCount = 100;
        const memberDetails = [];
        for (let i = 0; i < memberCount; i++) {
            try {
                const memberAddress = await contract.daoMembers(i);
                const memberStake = await contract.stakes(memberAddress);
                memberDetails.push({ address: memberAddress, stake: ethers.utils.formatEther(memberStake) });
            } catch (error) {
                console.error('Failed to fetch member:', error);
                break;
            }
        }
        setMembers(memberDetails);
    };

    const addStake = async () => {
        if (!daoContract || !additionalStake) return;
        try {
            const txResponse = await daoContract.addStake({ value: ethers.utils.parseEther(additionalStake) });
            await txResponse.wait();
            alert('Successfully added stake!');
            fetchStakedAmount(daoContract, currentAccount);
        } catch (error) {
            console.error('Failed to add stake:', error);
            alert('Error adding stake');
        }
    };

    const withdrawStake = async () => {
        if (!daoContract || !withdrawAmount) return;
        try {
            const txResponse = await daoContract.leaveDAO(ethers.utils.parseEther(withdrawAmount));
            await txResponse.wait();
            alert('Successfully withdrawn stake!');
            fetchStakedAmount(daoContract, currentAccount);
        } catch (error) {
            console.error('Failed to withdraw stake:', error);
            alert('Error withdrawing stake');
        }
    };

    const inputStyle = {
        flex: '1',
        marginRight: '10px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        margin: '10px',
    };

    const buttonStyle = {
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: 'white',
        cursor: 'pointer'
    };

    const cardStyle = {
        backgroundColor: '#1a202c',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '10px',
        flex: '1 1 calc(33.333% - 20px)',
        margin: '10px 20px',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        color: 'white',
        margin: '0 0 12px 0'
    };

    return (
        <div>
            <div style={headerStyle}>
                <button onClick={addStake} style={buttonStyle}>Add Stake</button>
                <input
                    type="text"
                    value={additionalStake}
                    onChange={e => setAdditionalStake(e.target.value)}
                    placeholder={`Amount to stake (${tickers[chainId] || 'Unknown'})`}
                    style={inputStyle}
                />
            </div>
            <div style={headerStyle}>
                <button onClick={withdrawStake} style={buttonStyle}>Withdraw Stake</button>
                <input
                    type="text"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder={`Amount to unstake (${tickers[chainId] || 'Unknown'})`}
                    style={inputStyle}
                />
            </div>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={cardStyle}>
                        <p>Staked Amount: {stakedAmount} {tickers[chainId] || 'Unknown'}</p>
                    </div>
                </div>
                <div style={cardStyle}>
                    <h2>DAO Members</h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={cardStyle}>
                        <h2>Address</h2>
                        {members.map((member, index) => (
                            <div key={index}>
                                <p>{member.address}</p>
                            </div>
                        ))}
                    </div>
                    <div style={cardStyle}>
                        <h2>Staked Amounts</h2>
                        {members.map((member, index) => (
                            <div key={index}>
                                <p>{member.stake} {tickers[chainId] || 'Unknown'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DAO;
