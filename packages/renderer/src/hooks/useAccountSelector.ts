import {useState, useEffect} from 'react';

// Define the account interface
interface Account {
  address: string;
  id: number;
  accountNumber: number;
  isLedgerEnabled: boolean;
  ledgerAccount: number;
  isUsingMnemonic: boolean;
}

// Define the hook
const useAccountSelector = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Load accounts from local storage on initialization
  useEffect(() => {
    const storedAccounts = localStorage.getItem('accounts');
    if (storedAccounts) {
      const parsedAccounts: Account[] = JSON.parse(storedAccounts);
      setAccounts(parsedAccounts);
    }
  }, []);

  // Function to add a new account
  const addAccount = (newAccount: Account) => {
    setAccounts(prevAccounts => [...prevAccounts, newAccount]);
  };

  // Function to update an existing account
  const updateAccount = (updatedAccount: Account) => {
    setAccounts(prevAccounts =>
      prevAccounts.map(account => (account.id === updatedAccount.id ? updatedAccount : account)),
    );
  };

  // Function to remove an account
  const removeAccount = (address: string) => {
    setAccounts(prevAccounts => prevAccounts.filter(account => account.address !== address));
  };

  // Store accounts in local storage whenever they change
  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  return {accounts, addAccount, updateAccount, removeAccount};
};

export default useAccountSelector;
