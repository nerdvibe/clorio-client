import { INodeInfo } from "../types/NetworkData";
import Datastore from "nedb-promises";
import { IWalletData } from "../types/WalletData";

const db = Datastore.create();

export const storeSession = async (
  address: string,
  id: number,
  isLedgerEnabled: boolean,
  ledgerAccount = 0
) => {
  const wallet = {
    type: "wallet",
    address: address,
    id: id,
    ledger: isLedgerEnabled || false,
    ledgerAccount,
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
  return db.findOne<INodeInfo>({ type: "network" });
};

export const readSession = async () => {
  return db.findOne<IWalletData>({ type: "wallet" });
};

export const clearSession = async () => {
  await db.remove({ type: "wallet" }, { multi: true });
};

export const updateUser = async (address: string, id: number) => {
  const walletData = await readSession();
  await db.remove({ type: "wallet" }, { multi: true });
  const wallet = {
    type: "wallet",
    address: address,
    id: id,
    ledger: walletData.ledger,
  };
  await db.insert(wallet);
};
