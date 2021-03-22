const Datastore = require('nedb-promises')
const db = Datastore.create();

export const isAuthenticated = () => {
  const address = localStorage.getItem("address");
  const privateKey = localStorage.getItem("privateKey");
  if (address && address.trim !== "" && privateKey && privateKey.trim !== "") {
    return true;
  }
  return false;
};

export const storeSession = async (address, id, isLedgerEnabled, ledgerAccount=0 ,callback) => {
  const wallet = {
    type: "wallet",
    address: address,
    id: id,
    ledger: isLedgerEnabled,
    ledgerAccount,
    coins: 0,
  };
  await db.insert(wallet)
  callback();
};

export const storeNetworkData = async (networkData) => {
  const network = {
    type: "network",
    ...networkData
  };
  return db.insert(network);
};

export const readNetworkData = async () => {
  return db.findOne({"type":"network"});
};

export const readSession = async (callback, goToHome) => {
  const result = await db.find({"type":"wallet"})
  if (result.length > 0) {
    try {
      const row = result[0];
      const dataToReturn = {
        ...row,
      };
      return callback(dataToReturn);
    } catch (error) {
      clearSession();
      callback({});
      return goToHome();
    }
  } else {
    callback({});
  }
};

export const getLedgerData = (callback, goToHome) => {
  db.find({}, (error, data) => {
    if (data.length > 0) {
      try {
        const row = data[0];
        const dataToReturn = {
          isLedgerEnabled:row.ledger,
          ledgerAccountNumber:row.ledgerAccount
        };
        return callback({dataToReturn});
      } catch (error) {
        clearSession();
        callback({
          isLedgerEnabled:false,
          ledgerAccountNumber:0
        });
        return goToHome();
      }
    }
    callback({});
  });
};

export const clearSession = async () => {
  await db.remove({"type":"wallet"});
};

export const getAddress = async (callback) => {
  const result = await db.find({"type":"wallet"});
  if(result){
    callback(result[0].address);
  }
};

export const getId = async (callback) => {
  const result = await db.find({"type":"wallet"})
  if (result?.length > 0) {
    return callback(result[0].id);
  }
  return undefined;
};

export const updateUser = async (address, id, isLedgerEnabled, callback) => {
  await db.remove({"type":"wallet"})
  const wallet = {
    type: "wallet",
    address: address,
    id: id,
    ledger: isLedgerEnabled,
    coins: 0,
  };
  await db.insert(wallet)
  if (callback) {
    callback();
  }
};
