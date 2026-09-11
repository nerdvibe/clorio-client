import {atom} from 'recoil';

export interface WalletState {
  address: string;
  /** Legacy backend account ID retained only for history compatibility. */
  id?: number;
  ledger: boolean;
  ledgerAccount: number;
  mnemonic: boolean;
  accountNumber: number;
  isAuthenticated: boolean;
}

export const initialWalletState: WalletState = {
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
