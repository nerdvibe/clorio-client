const { ipcRenderer } = window.require("electron");
export const TX_TYPE = {
  PAYMENT: 0x00,
  DELEGATION: 0x04,
}
export const NETWORK = {
  MAINNET: 0x01,
  DEVNET: 0x00,
}

/**
 * Checks if the Mina Ledger app is open on the device. If not open, throw an error
 * @returns {Promise<void>}
 */
export const isMinaAppOpen = async() => {
  const ledgerNameVersion = await ipcRenderer.invoke(
    "ledger-get-name-version",
  );
  if(ledgerNameVersion.returnCode !== '9000') {
    throw new Error("MinaHub couldn't communicate with the Ledger device")
  }
  if(ledgerNameVersion.name !== 'Mina') {
    throw new Error("Please make sure that you have the Mina app open on the Ledger device")
  }
}

/**
 * Returns the publicKey from the Ledger device on the given account number
 * @param {number} account
 * @returns {Promise<{publicKey}|any>}
 */
export const getPublicKey = async(account) => {
  const ledgerPublicKey = await ipcRenderer.invoke(
    "ledger-get-address",
    account
  );
  // In case the user doesn't accept the address on the device
  if(ledgerPublicKey.returnCode === '27013') {
    throw new Error(`Ledger error: couldn't verify the address`);
  }
  if(ledgerPublicKey.returnCode !== '9000' || !ledgerPublicKey.publicKey) {
    throw new Error(`Ledger error: ${ledgerPublicKey.message}`);
  }

  return ledgerPublicKey
}

/**
 * Signs a transaction on the Ledger device
 * @param transaction
 * @returns {Promise<{signature}|any>}
 */
export const signTransaction = async(transaction) => {
  const ledgerTransaction = await ipcRenderer.invoke(
    "ledger-sign-transaction",
    transaction
  );
  // In case the user doesn't accept the transaction on the device
  if(ledgerTransaction.returnCode === '27013') {
    throw new Error(`Ledger error: couldn't generate the signature`);
  }
  if(ledgerTransaction.returnCode !== '9000' || !ledgerTransaction.signature) {
    throw new Error(`Ledger error: ${ledgerTransaction.message}`);
  }

  return ledgerTransaction
}

/**
 * converts emoji to unicode
 * @param str
 * @returns str {*}
 */
export const emojiToUnicode = (str) => {
  return str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, function(e) {
    return "\\u" + e.charCodeAt(0).toString(16) + "\\u" + e.charCodeAt(1).toString(16);
  });
}

/**
 * escapes invalid unicode chars
 * @param str
 * @returns {string}
 */
export const escapeUnicode = (str) => {
  return [...str].map(c => /^[\x00-\x7F]$/.test(c) ? c : c.split("").map(a => "\\u" + a.charCodeAt().toString(16).padStart(4, "0")).join("")).join("");
}
