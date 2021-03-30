import { IWalletData } from '../models/wallet-data';
import { INodeInfo } from "../models/network-data";

const Datastore = require("nedb-promises");
const db = Datastore.create();

export const isAuthenticated = () => {
  const address = localStorage.getItem("address");
  const privateKey = localStorage.getItem("privateKey");
  if (address && address.trim() !== "" && privateKey && privateKey.trim() !== "") {
    return true;
  }
  return false;
};
export const storeSession = async (
  address:string,
  id:number,
  isLedgerEnabled:boolean,
  ledgerAccount = 0,
) => {
  const wallet = {
    type: "wallet",
    address: address,
    id: id,
    ledger: isLedgerEnabled,
    ledgerAccount,
    coins: 0,
  };
  return db.insert(wallet);
};

export const storeNetworkData = async (networkData:INodeInfo) => {
  const network = {
    type: "network",
    ...networkData,
  };
  return db.insert(network);
};

export const readNetworkData = async () => {
  return db.findOne({ type: "network" });
};

// TODO : REMOVE TS-IGNORE
export const readSession = async (callback:(data?:IWalletData)=>void, goToHome:()=>void) => {
  const result = await db.find({ type: "wallet" });
  if (result.length > 0) {
    try {
      const row = result[0];
      const dataToReturn = {
        ...row,
      };
      return callback(dataToReturn);
    } catch (error) {
      clearSession();
      // @ts-ignore
      callback({});
      return goToHome();
    }
  } else {
    // @ts-ignore
    callback({});
  }
};

export const getWalletData = async () => {
  return db.findOne({ type: "wallet" });
};

export const clearSession = async () => {
  await db.remove({ type: "wallet" });
};

export const getAddress = async () => {
  return db.findOne({ type: "wallet" });
};

export const updateUser = async (address:string, id:number) => {
  const walletData = await getWalletData();
  await db.remove({ type: "wallet" });
  const wallet = {
    type: "wallet",
    address: address,
    id: id,
    ledger: walletData.isLedgerEnabled,
    coins: 0,
  };
  await db.insert(wallet);
};
