import {atom} from 'recoil';

export interface NetworkConfigType {
  chainId: string;
  name: string;
}

export interface NetworkSettingsType {
  availableNetworks: NetworkConfigType[];
  showChangeNetworkModal: false;
  selectedNetwork?: NetworkConfigType;
}

export const networkState = atom<NetworkSettingsType>({
  key: 'availableNetworksAtom',
  default: {
    availableNetworks: [],
    showChangeNetworkModal: false,
    selectedNetwork: undefined,
  },
});
