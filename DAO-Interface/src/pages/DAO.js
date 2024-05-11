import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { AppContext } from '../context/AppContext';
import OracleABI from '../utils/abis/Oralce_ABI.json';
import { contractAddresses, tickers } from '../utils/chain-contants'

  
  const DAO = () => {
      const { currentAccount, networkProvider } = useContext(AppContext);
      const [daoContract, setDaoContract] = useState(null);
      const [chainId, setChainId] = useState('');
      const [stakedAmount, setStakedAmount] = useState('0');
      const [members, setMembers] = useState([]);
      const [additionalStake, setAdditionalStake] = useState('');
      const [withdrawAmount, setWithdrawAmount] = useState('');
      const [totalProposalFees, setTotalProposalFees] = useState('0');
      const [totalRequestFees, setTotalRequestFees] = useState('0');
      const [ticker, setTicker] = useState('');
      const [revenue, setRevenue] = useState('0');

  
      useEffect(() => {
          if (networkProvider) {
              networkProvider.getNetwork().then((network) => {
                  const hexChainId = network.chainId.toString(16);
                  setChainId(hexChainId);
                  setTicker(tickers[hexChainId] || 'Unknown'); // Set ticker or fallback to 'Unknown'
  
                  const contractAddress = contractAddresses[hexChainId];
                  if (contractAddress && currentAccount) {
                      const signer = networkProvider.getSigner();
                      const contract = new ethers.Contract(contractAddress, OracleABI, signer);
                      setDaoContract(contract);
                      fetchStakedAmount(contract, currentAccount);
                      fetchFees(contract);
                      fetchMembers(contract);
                  }
              });
          }
      }, [networkProvider, currentAccount]);
  
      useEffect(() => {
          console.log('Chain ID:', chainId);
          console.log('Ticker:', ticker);
      }, [chainId, ticker]);
  
      const fetchStakedAmount = async (contract, account) => {
          try {
              const amount = await contract.stakes(account);
              setStakedAmount(ethers.utils.formatEther(amount));
          } catch (error) {
              console.error('Failed to fetch staked amount:', error);
          }
      };
  
      const fetchFees = async (contract) => {
          try {
              const proposalFees = await contract.totalProposalFeesCollected();
              const requestFees = await contract.totalRequestFeesCollected();
              setTotalProposalFees(ethers.utils.formatEther(proposalFees));
              setTotalRequestFees(ethers.utils.formatEther(requestFees));
          } catch (error) {
              console.error('Failed to fetch fees:', error);
          }
      };

      const fetchMembers = async (contract) => {
        const memberCount = 100;
        const memberDetails = []
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
        calculateVotingPower(memberDetails);

    };
  
      const joinDAO = async () => {
          if (!daoContract) return;
          try {
              const txResponse = await daoContract.joinDAO({ value: ethers.utils.parseEther("1") });
              await txResponse.wait();
              alert('Successfully joined DAO!');
              fetchStakedAmount(daoContract, currentAccount);
              fetchFees(daoContract);
          } catch (error) {
              console.error('Failed to join DAO:', error);
              alert('Error joining DAO');
          }
      };
      const calculateVotingPower = (memberDetails) => {
        const totalStakes = memberDetails.reduce((acc, member) => acc + parseFloat(member.stake), 0);
        const updatedMembers = memberDetails.map(member => ({
            ...member,
            votingPower: ((parseFloat(member.stake) / totalStakes) * 100).toFixed(2) + '%'
        }));
        setMembers(updatedMembers);
    };
  
      const addStake = async () => {
          if (!daoContract || !additionalStake) return;
          try {
              const txResponse = await daoContract.addStake({ value: ethers.utils.parseEther(additionalStake) });
              await txResponse.wait();
              alert('Successfully added stake!');
              fetchStakedAmount(daoContract, currentAccount);
              fetchFees(daoContract);
              setAdditionalStake('');
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
              setWithdrawAmount('');
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
                <button onClick={joinDAO} style={buttonStyle}>Join DAO</button>
            </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={cardStyle}>
                    <p>Staked Amount: {stakedAmount} {ticker}</p>
                </div>
                <div style={cardStyle}>
                    <p>Proposal Fees Collected: {totalProposalFees} {ticker}</p>
                </div>
                <div style={cardStyle}>
                    <p>Request Fees Collected: {totalRequestFees} {ticker}</p>
                </div>
                <div style={cardStyle}>
                    <p>Total Reward Distributed: 15M {ticker}</p>
                </div>
                </div>  
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={cardStyle}>
                <input
                    type="text"
                    value={additionalStake}
                    onChange={e => setAdditionalStake(e.target.value)}
                    placeholder={`Amount to stake (${ticker})`}
                    style={inputStyle}
                />
                <button onClick={addStake} style={buttonStyle}>Add Stake</button>
            </div>
            <div style={cardStyle}>
                <input
                    type="text"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder={`Amount to unstake (${ticker})`}
                    style={inputStyle}
                />
                <button onClick={withdrawStake} style={buttonStyle}>Withdraw Stake</button>
            </div>
            </div>
            <div style={cardStyle}>
                    <h2>DAO Members</h2>
                </div>
            <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={cardStyle}>
                    <h2>Address</h2>
                </div>
                <div style={cardStyle}>
                    <h2>Staked Amounts</h2>
                </div>
                <div style={cardStyle}>
                    <h2>Revenue Sharing</h2>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{cardStyle, width: '100%', marginTop: '10pv'}}>
                    {members.map((member, index) => (
                        <div key={index} style={cardStyle}>
                            <p>{member.address}</p>
                        </div>
                    ))}
                </div>
                <div style={{cardStyle, width: '100%', marginTop: '10pv'}}>
                    {members.map((member, index) => (
                        <div key={index} style={cardStyle}>
                            <p>{member.stake} {ticker}</p>
                        </div>
                    ))}
                </div>
                <div style={{cardStyle, width: '100%', marginTop: '10pv'}}>
                {members.map((member, index) => (
                    <div key={index} style={cardStyle}>
                        <p>{member.votingPower}</p>
                    </div>
                ))}
            </div>
            </div>
        </div>
        </div>
    );
};

export default DAO;
