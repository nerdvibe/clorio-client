let ipcRenderer;
import isElectron from "is-electron";

// Wrapped Electron API for Ledger Devices

if (isElectron()) {
  // Import the node-hid
  ipcRenderer = window.require("electron").ipcRenderer;
}

export const isMinaAppOpen = async () => {
  if (!isElectron()) {
    throw new Error("Wrong environment");
  }
  return await ipcRenderer.invoke("ledger-get-name-version");
};
export const getPublicKey = async account => {
  if (!isElectron()) {
    throw new Error("Wrong environment");
  }
  return await ipcRenderer.invoke("ledger-get-address", account);
};
export const signTransaction = async transaction => {
  if (!isElectron()) {
    throw new Error("Wrong environment");
  }
  return await ipcRenderer.invoke("ledger-sign-transaction", transaction);
};
