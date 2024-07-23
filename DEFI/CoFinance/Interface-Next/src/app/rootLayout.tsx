'use client';

import React, { useState } from 'react';
import ConnectButton from '../components/ConnectButton';

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);

  return (
    <>
      <div className="fixed top-10 right-4 z-50">
        <ConnectButton account={account} setAccount={setAccount} />
      </div>
      <main className="flex-grow pt-20">
        {children}
      </main>
    </>
  );
};

export default ClientWrapper;
