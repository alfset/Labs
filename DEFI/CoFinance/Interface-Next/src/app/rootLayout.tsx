'use client'; // Ensure this is a client component

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname from next/navigation
import ConnectButton from '../components/ConnectButton';

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isTokenStakePage, setIsTokenStakePage] = useState<boolean>(false);
  const pathname = usePathname(); 

  useEffect(() => {
    console.log('Current pathname:', pathname); 
    setIsTokenStakePage(pathname === '/tokenstake');
  }, [pathname]);

  return (
    <>
      {!isTokenStakePage && (
        <div className="fixed top-10 right-4 z-50">
          <ConnectButton account={account} setAccount={setAccount} />
        </div>
      )}
      <main className="flex-grow pt-20">
        {children}
      </main>
    </>
  );
};

export default ClientWrapper;
