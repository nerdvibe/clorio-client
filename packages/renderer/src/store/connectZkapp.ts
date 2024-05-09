import {atom} from 'recoil';

export const connectZkappState = atom({
  key: 'connectZkappState',
  default: {
    showConnectZkapp: false,
    source: '',
    title: '',
  },
});
