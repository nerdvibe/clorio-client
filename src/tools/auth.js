import Datastore from "nedb";
const options = { filename: "./db/wallets.db", autoload: true };
const db = new Datastore(options);

export const isAuthenticated = () => {
  const address = localStorage.getItem("address");
  const privateKey = localStorage.getItem("privateKey");
  if (address && address.trim !== "" && privateKey && privateKey.trim !== "") {
    return true;
  }
  return false;
};

export const storeSession = (address, id, isLedgerEnabled, ledgerAccount=0 ,callback) => {
  const wallet = {
    rowName: "Wallet",
    address: address,
    id: id,
    ledger: isLedgerEnabled,
    ledgerAccount,
    coins: 0,
  };
  db.insert(wallet, () => {
    callback();
  });
};

export const storeNetworkData = (networkData) => {
  return new Promise((resolve)=>{
    if(networkData){
      const network = {
        rowName: "Network",
        ...networkData
      };
      db.insert(network, () => {
        resolve(true);
      });
    } else {
      resolve(false);
    }
  })
};

export const readNetworkData = () => {
  return new Promise((resolve)=>{
    db.findOne({"rowName":"Network"}, (error, data) => {
      if(data){
        resolve(data)
      } 
    })
  })
};

export const readSession = (callback, goToHome) => {
  db.find({"rowName":"Wallet"}, (error, data) => {
    if (data.length > 0) {
      try {
        const row = data[0];
        const dataToReturn = {
          ...row,
        };
        return callback(dataToReturn);
      } catch (error) {
        clearSession();
        callback({});
        return goToHome();
      }
    }
    callback({});
  });
};

export const clearSession = () => {
  db.remove({}, { multi: true }, function () {});
};

export const getAddress = (callback) => {
  return db.find({"rowName":"Wallet"}, function (err, data) {
    return callback(data[0].address);
  });
};

export const getId = (callback) => {
  return db.find({"rowName":"Wallet"}, function (err, data) {
    if (data && data.length > 0) {
      return callback(data[0].id);
    }
    return undefined;
  });
};

export const updateUser = (address, id, isLedgerEnabled, callback) => {
  db.remove({"rowName":"Wallet"}, { multi: true }, function () {
    const wallet = {
      rowName: "Wallet",
      address: address,
      id: id,
      ledger: isLedgerEnabled,
      coins: 0,
    };
    db.insert(wallet, () => {
      if (callback) {
        callback();
      }
    });
  });
};
