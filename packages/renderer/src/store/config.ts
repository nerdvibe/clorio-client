import {atom} from 'recoil';

export const configState = atom({
  key: 'config',
  default: {
    isAuthenticated: false,
    isLocked: false,
    isUsingMnemonic: false,
    isLedgerEnabled: false,
    isUsingPassword: false,
  },
});
