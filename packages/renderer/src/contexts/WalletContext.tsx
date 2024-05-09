import React, {ReactNode, createContext, useContext, useState} from 'react';

const WalletContext = createContext(null); // Remove the default value

export const WalletProvider = ({children}: {children: ReactNode}) => {
  const [wallet, setWallet] = useState({
    address: '',
    id: -1,
    ledger: false,
    ledgerAccount: 0,
    mnemonic: true,
    accountNumber: 0,
  });

  const updateWallet = newWallet => {
    setWallet(newWallet);
  };

  return <WalletContext.Provider value={{wallet, updateWallet}}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
