import {createContext, useState, useEffect} from 'react';
import {ReactChild} from 'react';
import {IBalanceContext} from './BalanceTypes';
const initialBalance = {
  liquid: '0',
  liquidUnconfirmed: '0',
  locked: '0',
  total: '0',
  unconfirmedTotal: '0',
};

export interface IBalance {
  liquid: string;
  liquidUnconfirmed: string;
  locked: string;
  total: string;
  unconfirmedTotal: string;
}

interface IProps {
  children: ReactChild;
}

export interface IBalanceData {
  balances: {[address: string]: IBalance};
}

export const BalanceContext = createContext<Partial<IBalanceContext>>({});

export const BalanceContextProvider = (props: IProps) => {
  const [shouldBalanceUpdate, setShouldBalanceUpdate] = useState<boolean>(false);
  const [balanceData, setBalanceData] = useState<IBalanceData>({
    balances: {}, // Initialize balances as an empty object
  });

  // Load balances from localStorage on initialization
  useEffect(() => {
    const storedBalances = localStorage.getItem('balances');
    if (storedBalances) {
      setBalanceData({balances: JSON.parse(storedBalances)});
    }
  }, []);

  const setBalanceContext = (address: string, balance: IBalance) => {
    const updatedBalances = {...balanceData.balances};
    updatedBalances[address] = balance;
    setBalanceData({balances: updatedBalances});

    // Save balances to localStorage
    localStorage.setItem('balances', JSON.stringify(updatedBalances));
  };

  const getBalance = (address: string) => {
    return balanceData.balances[address];
  };

  const addBalance = (address: string, balance: IBalance) => {
    const updatedBalances = {...balanceData.balances};

    // Check if the address is already stored, and if so, update the balance.
    // eslint-disable-next-line no-prototype-builtins
    if (updatedBalances?.hasOwnProperty(address)) {
      updatedBalances[address] = balance;
    } else {
      updatedBalances[address] = balance;
    }

    setBalanceData({balances: updatedBalances});

    // Save balances to localStorage
    localStorage.setItem('balances', JSON.stringify(updatedBalances));
  };

  const removeBalance = (address: string) => {
    const updatedBalances = {...balanceData.balances};
    delete updatedBalances[address];
    setBalanceData({balances: updatedBalances});

    // Save balances to localStorage
    localStorage.setItem('balances', JSON.stringify(updatedBalances));
  };

  const balanceContextValue = {
    shouldBalanceUpdate,
    balanceData,
    getBalance: (address: string) => balanceData.balances[address] || initialBalance, // Return initialBalance if the address is not found
    setBalanceContext,
    addBalance,
    removeBalance,
    setShouldBalanceUpdate,
  };

  return (
    <BalanceContext.Provider value={balanceContextValue}>{props.children}</BalanceContext.Provider>
  );
};

export const {Consumer} = BalanceContext;
