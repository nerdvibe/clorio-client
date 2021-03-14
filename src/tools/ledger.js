const delay = 1000; // 30 sec

const setDelay = (retVal) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccess = Math.random() < 0.7;
      if (isSuccess) {
        resolve(retVal);
      } else {
        reject(-1);
      }
    }, delay);
  });
};

const ledger = {
  getAddress: async (account) => {
    const address =
      account == 1
        ? "B62qoBEWahYw3CzeFLBkekmT8B7Z1YsfhNcP32cantDgApQ97RNUMhT"
        : "B62qoqqJds3GA9tFsS5DwSdFGsegFM1fnfpdoRkHfAhAY9Tpy9Uvb8N";
    const retVal = await setDelay(address);

    return retVal;
  },
  signTransaction: async ({
    account,
    sender,
    recipient,
    fee,
    amount,
    nonce,
    memo,
    txType,
    networkId,
    validUntil,
  }) => {
    if (
      !account ||
      !sender ||
      !recipient ||
      !fee ||
      !amount ||
      !txType ||
      !networkId ||
      !validUntil
    ) {
      console.log("🚀 ~ file: ledger.js ~ line 38 ~ memo", memo);
      console.log("🚀 ~ file: ledger.js ~ line 38 ~ nonce", nonce);
      throw new Error("Missing data");
    }
    const signature =
      "119558c6c24bbe32d0660bb5ce2a6896277e8a6351fed883549bfdae78e32f93126bcb5bd977a38673fd3dc5b8d7987bb86d194f7b5ae66531c63b6ab81de2489000";
    const retVal = await setDelay(signature);

    return retVal;
  },
  signDelegation: async ({
    account,
    sender,
    recipient,
    fee,
    nonce,
    txType,
    networkId,
  }) => {
    console.log("🚀 ~ file: ledger.js ~ line 65 ~ nonce", nonce);
    if (!account || !sender || !recipient || !txType || !networkId) {
      console.log("🚀 ~ file: ledger.js ~ line 67 ~ fee", fee);
      throw new Error("Missing data");
    }
    const signature =
      "119558c6c24bbe32d0660bb5ce2a6896277e8a6351fed883549bfdae78e32f93126bcb5bd977a38673fd3dc5b8d7987bb86d194f7b5ae66531c63b6ab81de2489000";
    const retVal = await setDelay(signature);

    return retVal;
  },
};

export default ledger;
