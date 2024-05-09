import {Big} from 'big.js';
import type {IBalanceData} from '../../contexts/balance/BalanceTypes';
import type {IValidatorData} from '../../components/stake/stakeTableRow/ValidatorDataTypes';

export enum ModalStates {
  PASSPHRASE = 'passphrase',
  CONFIRM_DELEGATION = 'confirm',
  CUSTOM_DELEGATION = 'custom',
  NONCE = 'nonce',
  FEE = 'fee',
  BROADCASTING = 'broadcasting',
}

export const initialDelegateData: IValidatorData = {
  publicKey: '',
};

/**
 * Throw error if the fee is greater than the balance
 * @param {number} transactionFee
 */
export const checkBalance = (transactionFee: number, balance?: IBalanceData) => {
  const available = +balance?.liquidUnconfirmed || 0;
  const balanceAfterTransaction = +Big(+available).minus(+transactionFee).toFixed();
  if (balanceAfterTransaction < 0) {
    throw new Error("You don't have enough funds");
  }
};
