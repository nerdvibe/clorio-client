import Datastore from 'nedb-promises';
import type {INodeInfo} from '../types/NetworkData';
import type {IWalletData} from '../types/WalletData';

const db = Datastore.create();

export const storeSession = async (
  address: string,
  id: number,
  isLedgerEnabled: boolean,
  ledgerAccount = 0,
  isUsingMnemonic: boolean,
  accountNumber = 0,
) => {
  await db.find({type: 'wallet'});
  await db.remove({type: 'wallet'}, {multi: true});

  const wallet = {
    type: 'wallet',
    address: address,
    id: id,
    ledger: isLedgerEnabled || false,
    ledgerAccount,
    mnemonic: isUsingMnemonic,
    accountNumber,
  };
  return await db.insert(wallet);
};

export const findAll = () => {
  return db.find({});
};

export const storeNetworkData = async (networkData: INodeInfo) => {
  const network = {
    type: 'network',
    ...networkData,
  };
  return db.insert(network);
};

export const readNetworkData = async () => {
  return db.findOne<INodeInfo>({type: 'network'});
};

export const readSession = async () => {
  return db.findOne<IWalletData>({type: 'wallet'});
};

export const clearSession = async () => {
  sessionStorage.removeItem('PASSPHRASE');
  await db.remove({type: 'PASSPHRASE'}, {multi: true});
  await db.remove({type: 'wallet'}, {multi: true});
};

export const updateUser = async (address: string, id: number) => {
  let walletData = await readSession();
  if (walletData?.ledger === undefined) {
    walletData = await readSession();
  }
  await db.remove({type: 'wallet'}, {multi: true});
  const wallet = {
    type: 'wallet',
    address: address,
    id: id,
    ledger: walletData?.ledger || false,
  };
  await db.insert(wallet);
};

export const getPassphrase = async () => {
  const storedPassphrase = await db.findOne({type: 'PASSPHRASE'});
  if (storedPassphrase) {
    return storedPassphrase.passphrase;
  }
  return undefined;
};

// TODO: Change name to "isUsingMnemonic", return to sessionStorage
export const setPassphrase = async (passphrase: boolean) => {
  return await db.insert({type: 'PASSPHRASE', passphrase});
};
// sessionStorage.setItem('PASSPHRASE', passphrase);

export const pushAccount = (account: {address: string; accountId: number}) => {
  const storedData = JSON.parse(localStorage.getItem('walletAccounts') || '[]');
  storedData.push(account);
  localStorage.setItem('walletAccounts', JSON.stringify(storedData));
};

export const storeAccounts = (accounts: {address: string; accountId: number}[]) => {
  localStorage.setItem('walletAccounts', JSON.stringify(accounts));
};

export const getAllAccounts = (): {address: string; accountId: number}[] => {
  const storedData = localStorage.getItem('walletAccounts');
  return storedData ? JSON.parse(storedData) : [];
};

export const removeAccountById = (accountId: number) => {
  const storedData = JSON.parse(localStorage.getItem('walletAccounts') || '[]');
  const updatedAccounts = storedData.filter(account => account.accountId !== accountId);
  localStorage.setItem('walletAccounts', JSON.stringify(updatedAccounts));
};

export const removeAccountByAddress = (address: string) => {
  const storedData = JSON.parse(localStorage.getItem('walletAccounts') || '[]');
  const updatedAccounts = storedData.filter(account => account.address !== address);
  localStorage.setItem('walletAccounts', JSON.stringify(updatedAccounts));
};

export const getAccountById = (accountId: number): {address: string; accountId: number} | null => {
  const storedData = JSON.parse(localStorage.getItem('walletAccounts') || '[]');
  return storedData.find(account => account.accountId === accountId) || null;
};

export const getAccountByAddress = (
  address: string,
): {address: string; accountId: number} | null => {
  const storedData = JSON.parse(localStorage.getItem('walletAccounts') || '[]');
  return storedData.find(account => account.address === address) || null;
};

export const clearAllAccounts = () => {
  localStorage.removeItem('walletAccounts');
};
