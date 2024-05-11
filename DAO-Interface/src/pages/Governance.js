import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { AppContext } from '../context/AppContext';
import OracleABI from '../utils/abis/Oralce_ABI.json';  

const contractAddress = '0x7b4c331cC2CB5D638D3c3c8145DE2BE9C276e7ca';

const Governance = () => {
    const { currentAccount, networkProvider } = useContext(AppContext);
    const [daoContract, setDaoContract] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [newProposalDescription, setNewProposalDescription] = useState('');
    const [proposalIdInput, setProposalIdInput] = useState('');

    useEffect(() => {
        if (networkProvider && currentAccount) {
            const signer = networkProvider.getSigner(currentAccount);
            const contract = new ethers.Contract(contractAddress, OracleABI, signer);
            setDaoContract(contract);
            fetchProposalById('0xcf250fe148b9c68e387af65009ea7b5a86a709073f684383202eb33f1ec1d6da'); 
        }
    }, [networkProvider, currentAccount]);

    const fetchProposalById = async () => {
        if (!daoContract || !proposalIdInput) return;

        try {
            const proposal = await daoContract.proposals('0xcf250fe148b9c68e387af65009ea7b5a86a709073f684383202eb33f1ec1d6da');
            console.log('Fetched Proposal:', proposal);
            setProposals([proposal]); 
        } catch (error) {
            console.error('Error fetching the proposal by ID:', error);
        }
    };

    const handleNewProposal = async () => {
        if (!daoContract || !newProposalDescription) return;

        try {
            const txResponse = await daoContract.openProposal(newProposalDescription, {
                value: ethers.utils.parseEther("1")
            });
            await txResponse.wait();
            setNewProposalDescription('');  
            alert('Proposal submitted successfully!');
        } catch (error) {
            console.error('Failed to submit proposal:', error);
            alert('Error submitting proposal');
        }
    };

    const handleVote = async (proposalId, vote) => {
        if (!daoContract || !proposalId) return;

        try {
            const txResponse = await daoContract.voteOnProposal(proposalId, vote);
            await txResponse.wait();
            alert('Vote submitted successfully!');
        } catch (error) {
            console.error('Failed to submit vote:', error);
            alert('Error submitting vote');
        }
    };

    const styles = {
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: '#282c34',
            color: 'white',
            padding: '20px'
        },
        header: {
            color: 'white',
            fontWeight: 'bold',
            marginBottom: '20px'
        },
        textareaStyle: {
            width: '100%',
            minHeight: '100px',
            marginRight: '10px',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: '#333',
            color: 'white',
            marginBottom: '10px',
            resize: 'none'
        },
        buttonStyle: {
            marginRight: '10px',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#4CAF50',
            color: 'white',
            cursor: 'pointer'
        },
        card: {
            backgroundColor: '#333',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '10px',
            color: 'white'
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>DAO Proposals</h1>
            <div>
                <textarea
                    style={styles.textareaStyle}
                    value={newProposalDescription}
                    onChange={e => setNewProposalDescription(e.target.value)}
                    placeholder="Enter your proposal"
                />
                <button onClick={handleNewProposal} style={styles.buttonStyle}>Submit Proposal</button>
            </div>
            <h2 style={styles.header}>Active Proposals</h2>
            {proposals.map((proposal, index) => (
                <div key={index} style={styles.card}>
                    <p>{proposal.description}</p>
                    <button onClick={() => handleVote(proposal.id, true)} style={styles.buttonStyle}>Vote Yes</button>
                    <button onClick={() => handleVote(proposal.id, false)} style={styles.buttonStyle}>Vote No</button>
                </div>
            ))}
        </div>
    );
};

export default Governance;