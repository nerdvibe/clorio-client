import {atom} from 'recoil';

interface DepplinkAtomProps {
  type?: string;
  data?: string;
}

export const deeplinkState = atom<DepplinkAtomProps>({
  key: 'deeplinkAtom',
  default: {
    type: '',
    data: '',
  },
});
