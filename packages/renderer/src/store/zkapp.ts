import {atom} from 'recoil';

export const zkappInitialState = {
  isPendingConfirmation: false,
  txtpe: null,
  showTransactionConfirmation: false,
  showPaymentConfirmation: false,
  showDelegationConfirmation: false,
  transactionData: {
    from: '',
    to: '',
    amount: '',
    fee: '',
    nonce: '',
    memo: '',
  },
  showMessageSign: false,
  messageToSign: '',
  isJsonMessageToSign: false,
  isNullifier: false,
  isFields: false,
  isZkappCommand: false,
};

export const zkappState = atom({
  key: 'zkapp',
  default: zkappInitialState,
});
