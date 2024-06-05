import {atom} from 'recoil';
import {INetworkOption} from '../hooks/useNetworkSettings';

export interface NetworkConfigType {
  chainId: string;
  name: string;
}

export interface NetworkSettingsType {
  availableNetworks: NetworkConfigType[];
  showChangeNetworkModal: boolean;
  selectedNetwork?: NetworkConfigType | INetworkOption;
  switchNetwork?: string;
  addChainData?: {name: string; url: string};
  isAddingChain: boolean;
  selectedNode?: INetworkOption;
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
    selectedNode: undefined,
  },
});
