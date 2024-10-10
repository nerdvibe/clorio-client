import {atom} from 'recoil';

export const initialWalletState = {
  address: '',
  id: -1,
  ledger: false,
  ledgerAccount: 0,
  mnemonic: true,
  accountNumber: 0,
  isAuthenticated: false,
};

export const walletState = atom({
  key: 'walletState',
  default: initialWalletState,
});
