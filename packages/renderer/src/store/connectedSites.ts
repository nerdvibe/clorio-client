import {atom} from 'recoil';
import {recoilPersist} from 'recoil-persist';

const {persistAtom} = recoilPersist();

export const connectedSitesState = atom({
  key: 'connectedSitesState',
  default: {
    sites: [],
  },
  effects_UNSTABLE: [persistAtom],
});
