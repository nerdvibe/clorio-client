import { Big } from "big.js";
import { IBalanceData } from "./../../context/balance/BalanceInterfaces";
import { ITransactionData } from "./../../models/TransactionData";
import {
  DEFAULT_FEE,
  INITIAL_TRANSACTION_AMOUNT,
  MINIMUM_NONCE,
} from "./../../tools/const";
import { toNanoMINA } from "../../tools";
import { emojiToUnicode, escapeUnicode } from "../../tools/ledger";

export enum ModalStates {
  PASSPHRASE = "passphrase",
  BROADCASTING = "broadcasting",
  NONCE = "nonce",
}

export enum SendTXPageSteps {
  FORM = 0,
  CONFIRMATION = 1,
}

export const initialTransactionData = {
  amount: toNanoMINA(INITIAL_TRANSACTION_AMOUNT),
  receiverAddress: "",
  fee: toNanoMINA(DEFAULT_FEE),
  nonce: MINIMUM_NONCE,
  memo: "",
};

/**
 * Check if nonce is not empty
 * @returns number Wallet usable nonce
 */
export const checkNonce = (nonceQuery: any) => {
  return (
    nonceQuery.data?.accountByKey?.usableNonce ||
    nonceQuery.data?.accountByKey?.usableNonce === 0
  );
};

interface IBalanceBeforeTransaction {
  balance: IBalanceData;
  transactionData: ITransactionData;
}

export const checkBalanceAfterTransaction = ({
  balance,
  transactionData,
}: IBalanceBeforeTransaction) => {
  const { fee, amount } = transactionData;
  const available = balance.liquidUnconfirmed;
  const balanceAfterTransaction = Big(available)
    .minus(fee)
    .minus(amount)
    .toNumber();
  if (balanceAfterTransaction < 0) {
    throw new Error(
      "Your are trying to send too many Mina, please check your balance",
    );
  }
};

export const checkTransactionFields = (transactionData: ITransactionData) => {
  if (transactionData.receiverAddress === "" || transactionData.amount === 0) {
    throw new Error("Please insert an address and an amount");
  }
};

export const checkMemoLength = (transactionData: ITransactionData) => {
  // For now mina-ledger-js doesn't support emojis
  const memo = escapeUnicode(emojiToUnicode(transactionData.memo || ""));
  if (memo.length > 32) {
    throw new Error("Memo field too long");
  }
};
