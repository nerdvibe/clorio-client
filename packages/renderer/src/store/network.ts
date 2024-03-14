import {atom} from 'recoil';

export interface NetworkConfigType {
  chainId: string;
  name: string;
}

export interface NetworkSettingsType {
  availableNetworks: NetworkConfigType[];
  showChangeNetworkModal: boolean;
  selectedNetwork?: NetworkConfigType;
  switchNetwork?: string;
  addChainData?: {name: string; url: string};
  isAddingChain:boolean
}

export const networkState = atom<NetworkSettingsType>({
  key: 'availableNetworksAtom',
  default: {
    availableNetworks: [],
    showChangeNetworkModal: false,
    selectedNetwork: undefined,
    switchNetwork: undefined,
    addChainData: undefined,
    isAddingChain: false,
  },
});
