import Big from "big.js";
import * as bip39 from "bip39";
import * as bip32 from "bip32";
// @ts-ignore
import * as bs58check from "bs58check";
// @ts-ignore
import * as RawSDK from "@o1labs/client-sdk/src/client_sdk.bc";
import { MINA_COIN_INDEX } from "./const";
import { derivePublicKey } from "@o1labs/client-sdk";

export const toNanoMINA = (amount: number | string) => {
  return +Big(amount).mul(1e9).toFixed();
};

export const toMINA = (amount: number | string) => {
  return +Big(amount).mul(1e-9).toFixed(3);
};

export const toLongMINA = (amount: number | string) => {
  return Big(amount).mul(1e-9).toFixed();
};

/**
 * Determine if the input value is a passphrase or a private key.
 * Then derive the wallet data with the corresponding method.
 * @param value Private key or Passphrase
 * @returns Keypair
 */
export const deriveAccount = async (value: string) => {
  if (value.trim().split(" ").length > 2) {
    const derivedAccount = await deriveAccountFromMnemonic(value);
    return {
      publicKey: derivedAccount?.pubKey,
      privateKey: derivedAccount?.priKey,
    };
  } else {
    const publicKey = derivePublicKey(value);
    return {
      publicKey,
      privateKey: value,
    };
  }
};

/**
 * Check if the input mnemonic has enough words, then validate it through bip39.
 * @param mnemonic mnemonic passphrase
 * @returns Keypair
 */
export const deriveAccountFromMnemonic = async (mnemonic: string) => {
  const mneList = mnemonic.trim().split(" ");
  if (mneList.length !== 12) {
    throw new Error("Passphrase should be 12 words long");
  }
  const validMnemonic = bip39.validateMnemonic(mnemonic);
  if (!validMnemonic) {
    throw new Error("Invalid passphrase");
  }
  const wallet = await deriveWalletByMnemonic(mnemonic);
  return wallet;
};

/**
 * Derive the wallet keypair through the mnemonic passphrase
 * @param mnemonic passphrase
 * @param accountNumber
 * @returns Keypair
 */
export const deriveWalletByMnemonic = async (
  mnemonic: string,
  accountNumber = 0
) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const masterNode = bip32.fromSeed(seed);
  const hdPath = getHDpath(accountNumber);
  const child0 = masterNode.derivePath(hdPath);
  if (child0?.privateKey) {
    child0.privateKey[0] &= 0x3f;
    const childPrivateKey = reverseBytes(child0.privateKey);
    const privateKeyHex = `5a01${childPrivateKey.toString("hex")}`;
    const privateKey = bs58check.encode(Buffer.from(privateKeyHex, "hex"));
    const publicKey = RawSDK.codaSDK.publicKeyOfPrivateKey(privateKey);
    return {
      priKey: privateKey,
      pubKey: publicKey,
      hdIndex: accountNumber,
    };
  }
};

/**
 * Hierarchical Deterministic path
 * @param account Account number
 * @returns HD path
 */
export const getHDpath = (account = 0) => {
  const purpse = 44;
  const index = 0;
  const charge = 0;
  const hdpath =
    "m/" +
    purpse +
    "'/" +
    MINA_COIN_INDEX +
    "'/" +
    account +
    "'/" +
    charge +
    "/" +
    index;
  return hdpath;
};

const reverseBytes = (bytes: any) => {
  const uint8 = new Uint8Array(bytes);
  const reversedBytes = new Buffer(uint8.reverse());
  return reversedBytes;
};
