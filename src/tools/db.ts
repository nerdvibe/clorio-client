import { INodeInfo } from "../models/NetworkData";

const Datastore = require("nedb-promises");
const db = Datastore.create();

export const storeSession = async (
  address: string,
  id: number,
  isLedgerEnabled: boolean,
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

export const storeNetworkData = async (networkData: INodeInfo) => {
  const network = {
    type: "network",
    ...networkData,
  };
  return db.insert(network);
};

export const readNetworkData = async () => {
  return db.findOne({ type: "network" });
};

export const readSession = async () => {
  return db.findOne({ type: "wallet" });
};

export const clearSession = async () => {
  await db.remove({ type: "wallet" });
};

export const updateUser = async (address: string, id: number) => {
  const walletData = await readSession();
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
