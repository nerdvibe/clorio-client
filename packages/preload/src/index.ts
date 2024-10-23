/**
 * @module preload
 */
import {contextBridge, ipcMain, ipcRenderer} from 'electron';
// @ts-ignore
import appendQuery from 'append-query';
import type {Query} from 'append-query';
window.__dirname = __dirname;
export {
  bip32,
  bip39,
  generateKeypair,
  ecc,
  fromSeed,
  mnemonicToSeed,
  mnemonicToPrivateKey,
} from './bip';
import zkappIntegration from './zkapp-mina-env';

declare global {
  interface Window {
    ipcRenderer: typeof ipcRenderer;
  }
}

window.ipcRenderer = ipcRenderer;

// TODO: Fix later
// const allowedInvokeChannels = [
//   'ledger-get-name-version',
//   'ledger-get-address',
//   'ledger-sign-transaction',
//   'open-win',
//   'navigate',
//   'REQUEST_NETWORK',
// ];

// const allowedSendChannels = [
//   'CHECK_FOR_UPDATE_PENDING',
//   'UPDATE_ERROR',
//   'CHECK_FOR_UPDATE_SUCCESS',
//   'DOWNLOAD_UPDATE_SUCCESS',
// ];

// const allowedOnChannels = [
//   'CHECK_FOR_UPDATE_SUCCESS',
//   'UPDATE_ERROR',
//   'DOWNLOAD_UPDATE_SUCCESS',
//   'DOWNLOAD_UPDATE_FAILURE',
//   'REQUEST_NETWORK',
// ];

contextBridge.exposeInMainWorld('deeplink', {
  onDeeplink: (callback: (url: string) => void) => {
    ipcRenderer.on('deeplink', (event, url) => {
      callback(url);
    });
  },
  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },
});

contextBridge.exposeInMainWorld('ipcBridge', {
  invoke: (text: string, data: unknown) => {
    // if (allowedInvokeChannels.includes(text)) {
    return ipcRenderer.invoke(text, data);
    // }
  },
  send: (text: string, data: unknown) => {
    // if (allowedSendChannels.includes(text)) {
    return ipcRenderer.send(text, data);
    // }
  },
  on: (text: string, callback: (event: unknown, ...args: any[]) => void) => {
    // if the channel has been already registered, remove it
    if (ipcRenderer.listenerCount(text) > 0) {
      ipcRenderer.removeAllListeners(text);
    }
    // register the new listener
    return ipcRenderer.on(text, callback);
  },
  mainOn: (text: string, callback: (event: unknown, ...args: any[]) => void) => {
    // if (allowedOnChannels.includes(text)) {
    return ipcMain.on(text, callback);
    // }
  },
  off: (text: string, callback: (event: unknown, ...args: any[]) => void) => {
    return ipcRenderer.off(text, callback);
  },
  listenerCount: (text: string) => {
    return ipcRenderer.listenerCount(text);
  },
});

contextBridge.exposeInMainWorld('mina', zkappIntegration);

const appendQueryParams = (url: string, params: string | Query) => {
  return appendQuery(url, params);
};

export {appendQueryParams};
