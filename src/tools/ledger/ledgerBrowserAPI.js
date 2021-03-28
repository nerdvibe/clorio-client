import Transporter from '@ledgerhq/hw-transport-webhid';
import { MinaLedgerJS } from "mina-ledger-js";
import isElectron from 'is-electron';

// Wrapped Browser API for Ledger Devices

export const isMinaAppOpen = async() => {
  if(isElectron()) {
    throw new Error('Wrong environment')
  }
  const transport = await Transporter.create();
  transport.setDebugMode(true);
  const instance = new MinaLedgerJS(transport);
  const appName = await instance.getAppName();
  transport.close()
  return appName
}
export const getPublicKey = async(account) => {
  if(isElectron()) {
    throw new Error('Wrong environment')
  }
  const transport = await Transporter.create();
  const instance = new MinaLedgerJS(transport);
  const address = await instance.getAddress(
    account
  )
  transport.close()
  return address
}
export const signTransaction = async(transaction) => {
  if(isElectron()) {
    throw new Error('Wrong environment')
  }
  const transport = await Transporter.create();
  const instance = new MinaLedgerJS(transport);
  const signature = await instance.signTransaction(
    transaction
  );
  transport.close()
  return signature;
}
