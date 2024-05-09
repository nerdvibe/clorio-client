/**
 * @module preload
 */
import {contextBridge, ipcRenderer} from 'electron';
// @ts-ignore
import appendQuery from 'append-query';
import type {Query} from 'append-query';

export {
  bip32,
  bip39,
  generateKeypair,
  ecc,
  fromSeed,
  mnemonicToSeed,
  mnemonicToPrivateKey,
} from './bip';

const allowedInvokeChannels = [
  'ledger-get-name-version',
  'ledger-get-address',
  'ledger-sign-transaction',
];

const allowedSendChannels = [
  'CHECK_FOR_UPDATE_PENDING',
  'UPDATE_ERROR',
  'CHECK_FOR_UPDATE_SUCCESS',
  'DOWNLOAD_UPDATE_SUCCESS',
];

const allowedOnChannels = [
  'CHECK_FOR_UPDATE_SUCCESS',
  'UPDATE_ERROR',
  'DOWNLOAD_UPDATE_SUCCESS',
  'DOWNLOAD_UPDATE_FAILURE',
];

contextBridge.exposeInMainWorld('ipcBridge', {
  invoke: (text: string, data: unknown) => {
    if (allowedInvokeChannels.includes(text)) {
      return ipcRenderer.invoke(text, data);
    }
  },
  send: (text: string, data: unknown) => {
    if (allowedSendChannels.includes(text)) {
      return ipcRenderer.send(text, data);
    }
  },
  on: (text: string, callback: (event: unknown, ...args: any[]) => void) => {
    if (allowedOnChannels.includes(text)) {
      return ipcRenderer.on(text, callback);
    }
  },
});

const appendQueryParams = (url: string, params: string | Query) => {
  return appendQuery(url, params);
};

export {appendQueryParams};
