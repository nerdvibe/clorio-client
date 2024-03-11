import {atom} from 'recoil';

export const zkappState = atom({
  key: 'zkapp',
  default: {
    isPendingConfirmation: false,
    txtpe: null,
    showTransactionConfirmation: false,
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
  },
});
