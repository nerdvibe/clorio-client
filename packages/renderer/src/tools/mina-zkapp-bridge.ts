import {AES, enc} from 'crypto-js';
import {deriveWalletByMnemonic} from './mina';

export interface NetConfig {
  netType: string;
  name: string;
}

export interface TransactionParams {
  isSpeedUp: boolean;
  memo: string;
}

export interface SignedTransaction {
  error?: string;
  // Add other properties of the signed transaction here
}

export interface IpcBridge {
  on: (eventName: string, callback: (event: any, data: any) => void) => void;
  off: (eventName: string) => void;
  send: (eventName: string, data: string) => void;
  listenerCount: (eventName: string) => number;
}

declare global {
  interface Window {
    ipcBridge: IpcBridge;
  }
}

const WALLET_ACCOUNTS_KEY = 'walletAccounts';
const ENCRYPTED_DATA_KEY = 'encryptedData';

export const sendResponse = (eventName: string, data: any) => {
  console.log(`Sending response for event: ${eventName}`);
  window.ipcBridge.send(eventName, JSON.stringify(data));
};

export const getAccountAddress = (): string => {
  console.log('Getting account address...');
  const accountJson = localStorage.getItem(WALLET_ACCOUNTS_KEY);
  if (!accountJson) {
    console.error('No wallet accounts found in local storage');
    throw new Error('No wallet accounts found in local storage');
  }

  const accounts = JSON.parse(accountJson).map(account => {
    return account.address;
  });
  console.log(`Account address: ${accounts}`);
  return accounts;
};

export const getPrivateKey = async (password: string): Promise<string> => {
  console.log('Getting private key...');
  const encrypted = localStorage.getItem(ENCRYPTED_DATA_KEY);
  let privateKey = '';

  if (encrypted) {
    const mnemonic = AES.decrypt(encrypted, password).toString(enc.Utf8);
    privateKey = (await deriveWalletByMnemonic(mnemonic)).priKey;
  }

  return privateKey;
};
