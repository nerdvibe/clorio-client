let ipcRenderer: any;
import isElectron from "is-electron";
import { ILedgerTransaction } from "../../types/LedgerDelegationTransaction";

// Wrapped Electron API for Ledger Devices

// if (isElectron()) {
//   // Import the node-hid
//   ipcRenderer = window.require("electron").ipcRenderer;
// }

export const isMinaAppOpen = async () => {
  if (!isElectron()) {
    throw new Error("Wrong environment");
  }
  const { ipcRenderer } = await import("electron");
  return await ipcRenderer.invoke("ledger-get-name-version");
};
export const getPublicKey = async (account: number) => {
  if (!isElectron()) {
    throw new Error("Wrong environment");
  }
  const { ipcRenderer } = await import("electron");
  return await ipcRenderer.invoke("ledger-get-address", account);
};
export const signTransaction = async (transaction: ILedgerTransaction) => {
  if (!isElectron()) {
    throw new Error("Wrong environment");
  }
  const { ipcRenderer } = await import("electron");
  return await ipcRenderer.invoke("ledger-sign-transaction", transaction);
};
