import {Big} from 'big.js';
import type {IBalanceData} from '../../contexts/balance/BalanceTypes';
import type {ITransactionData} from '../../types/TransactionData';
import {DEFAULT_FEE, INITIAL_TRANSACTION_AMOUNT, MINIMUM_NONCE} from '../../tools';
import {toNanoMINA} from '../../tools';
import {emojiToUnicode, escapeUnicode} from '../../tools/ledger';

export enum ModalStates {
  PASSPHRASE = 'passphrase',
  BROADCASTING = 'broadcasting',
  NONCE = 'nonce',
}

export enum SendTXPageSteps {
  FORM = 0,
  PRIVATE_KEY = 1,
  CONFIRMATION = 2,
  BROADCAST = 3,
}

export interface INonceQueryResult {
  accountByKey: {
    usableNonce: number;
  };
}

export interface INonceAndBalanceQueryResult {
  accountByKey: {
    usableNonce: number;
    balance: {
      liquidUnconfirmed: number;
      total: number;
      liquid: number;
      locked: number;
      unconfirmedTotal: number;
    };
  };
}

export const initialTransactionData = {
  senderAddress: '',
  amount: toNanoMINA(INITIAL_TRANSACTION_AMOUNT),
  receiverAddress: '',
  fee: toNanoMINA(DEFAULT_FEE),
  nonce: MINIMUM_NONCE,
  memo: '',
};

/**
 * Check if nonce is not empty
 * @returns number Wallet usable nonce
 */
export const checkNonce = (nonceData?: INonceQueryResult) => {
  return nonceData?.accountByKey?.usableNonce || nonceData?.accountByKey?.usableNonce === 0;
};

interface IBalanceBeforeTransaction {
  balance?: IBalanceData;
  transactionData: ITransactionData;
}

export const checkBalanceAfterTransaction = ({
  balance,
  transactionData,
}: IBalanceBeforeTransaction) => {
  const {fee, amount} = transactionData;
  const available = +balance?.liquidUnconfirmed || 0;
  const balanceAfterTransaction = +Big(+available).minus(+fee).minus(+amount).toFixed();
  if (balanceAfterTransaction < 0) {
    throw new Error('Your are trying to send too many Mina, please check your balance');
  }
};

/**
 * Check if the receiver and the amount are not empty
 * @param transactionData
 */
export const checkTransactionFields = (transactionData: ITransactionData) => {
  if (!transactionData.receiverAddress || transactionData.amount === 0) {
    throw new Error('Please insert an address and an amount');
  }
};

export const checkMemoLength = (transactionData: ITransactionData) => {
  // For now mina-ledger-js doesn't support emojis
  const memo = escapeUnicode(emojiToUnicode(transactionData.memo || ''));
  if (memo.length > 32) {
    throw new Error('Memo field too long');
  }
};
