import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { AppContext } from '../context/AppContext';
import { BsPlus, BsChevronDown, ImArrowUpRight2, BsWallet } from '@react-icons/all-files';
import Button from '../components/Button';

const contractAddress = '0x8Dcb1F18ccFFb31725638C4EDDe570c4a1df1Da3';
const OracleABI = require('../utils/abis/CoFinacne.json'); 

const Governance = () => {
    const { currentAccount, networkProvider } = useContext(AppContext);
    const [daoContract, setDaoContract] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (networkProvider && currentAccount) {
            const signer = networkProvider.getSigner(currentAccount);
            const contract = new ethers.Contract(contractAddress, OracleABI, signer);
            setDaoContract(contract);
            // Optionally fetch initial data or perform other setup
        }
    }, [networkProvider, currentAccount]);

    const handleAddLiquidity = async () => {
        if (!daoContract) return;

        try {
            // Implement your liquidity addition logic here
            // Example: const txResponse = await daoContract.addLiquidity(...);
            alert('Liquidity added successfully!');
        } catch (error) {
            console.error('Failed to add liquidity:', error);
            alert('Error adding liquidity');
        }
    };

    const handleClick = () => {
        setOpen(false);
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
        },
        dropdown: {
            border: '1px solid #00000030',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            cursor: 'pointer'
        },
        dropdownContent: {
            position: 'absolute',
            backgroundColor: '#1a202c',
            minWidth: '160px',
            boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
            zIndex: '1',
            borderRadius: '8px',
            overflow: 'hidden',
            marginTop: '5px'
        },
        dropdownItem: {
            color: 'white',
            padding: '12px 16px',
            textDecoration: 'none',
            display: 'block'
        }
    };

    return (
        <section>
            <main className="container w-auto max-w-4xl min-h-screen py-20 mx-auto bg-base-100">
                <div style={styles.container}>
                    <h1 style={styles.header}>Liquidity Pools</h1>
                    <div className="flex items-center justify-between">
                        <span className="text-4xl font-medium text-black dark:text-white">Pools</span>
                        <div className="flex items-center gap-4 w-fit">
                            <div
                                className="dropdown"
                                style={styles.dropdown}
                                onClick={() => setOpen(!open)}
                            >
                                <label className="capitalize border border-black/30 dark:border-white/10 btn btn-ghost">
                                    More <BsChevronDown />
                                </label>
                                {open && (
                                    <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52" style={styles.dropdownContent}>
                                        <li onClick={handleClick} style={styles.dropdownItem}>
                                            <a className="flex items-center justify-between">
                                                Migrate <BsChevronDoubleRight />
                                            </a>
                                        </li>
                                        <li onClick={handleClick} style={styles.dropdownItem}>
                                            <a className="flex items-center justify-between">
                                                V2 Liquidity <ImStack />
                                            </a>
                                        </li>
                                    </ul>
                                )}
                            </div>
                            <Button
                                gradient="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-md shadow-blue-500/50"
                                rounded="lg"
                                onClick={handleAddLiquidity}
                            >
                                <BsPlus size={20} /> Add Liquidity
                            </Button>
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="border rounded-xl border-black/30 dark:border-white/10">
                        {/* Liquidity pool content */}
                        <div className="flex flex-col items-center w-full gap-10 p-8 pb-10">
                            <div className="flex flex-col items-center w-full gap-4 text-sm font-medium">
                                <BsWallet size={48} />
                                <span className="text-center text-black dark:text-white">
                                    Your active liquidity positions will appear here.
                                </span>
                            </div>
                            <Button
                                gradient="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-md shadow-blue-500/50"
                                rounded="lg"
                                other="w-80 rounded-xl text-lg"
                                onClick={() => alert('Feature coming soon!')}
                            >
                                Connect Wallet
                            </Button>
                        </div>
                    </div>
                    {/* Suggestions */}
                    <ul className="w-full gap-2 menu menu-horizontal">
                        <li className="flex-1 border rounded-lg border-black/30 dark:border-white/10">
                            <div className="flex flex-col justify-start w-full p-4 font-medium text-md text-black/80 dark:text-white/60 hover:text-black/60 hover:dark:text-white/40">
                                <span className="flex flex-row items-baseline w-full gap-2">
                                    Learn more about providing liquidity <ImArrowUpRight2 />
                                </span>
                                <span className="w-full">
                                    Check out our liquidity provider walkthrough and guides.
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </main>
        </section>
    );
};

export default Governance;
