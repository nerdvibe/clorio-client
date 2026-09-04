import {createContext, useContext, ReactNode} from 'react';
import {
  IAvailableNetworks,
  INetworkOption,
  NetworkOptionInput,
  normalizeNetworkSettings,
  useNetworkSettings,
} from '../hooks/useNetworkSettings';
import {normalizeApiUrl} from '../api/http';

interface NetworkSettingsContextType {
  settings: INetworkOption | null;
  saveSettings: (settings: NetworkOptionInput) => boolean;
  clearSettings: () => void;
  setAvailableNetworks: (networks: IAvailableNetworks) => void;
  availableNetworks: IAvailableNetworks;
}

const NetworkSettingsContext = createContext<NetworkSettingsContextType | undefined>(undefined);

export function NetworkSettingsProvider({children}: {children: ReactNode}) {
  const {settings, saveSettings, clearSettings, setAvailableNetworks, availableNetworks} =
    useNetworkSettings();

  return (
    <NetworkSettingsContext.Provider
      value={{settings, saveSettings, clearSettings, setAvailableNetworks, availableNetworks}}
    >
      {children}
    </NetworkSettingsContext.Provider>
  );
}

export function useNetworkSettingsContext() {
  const context = useContext(NetworkSettingsContext);
  if (context === undefined) {
    throw new Error('useNetworkSettingsContext must be used within a NetworkSettingsProvider');
  }
  return context;
}

const getApolloCompatibilityUrl = (network: Record<string, unknown>): string | undefined => {
  if (typeof network.url !== 'string') {
    return undefined;
  }
  try {
    normalizeApiUrl(network.url);
    return network.url;
  } catch {
    return undefined;
  }
};

export function formatNetworks(data: unknown): IAvailableNetworks {
  if (!data || typeof data !== 'object') {
    return [];
  }

  return Object.values(data).flatMap(value => {
    const network = normalizeNetworkSettings(value);
    if (!network) {
      return [];
    }
    const compatibilityUrl = getApolloCompatibilityUrl(value as Record<string, unknown>);
    return [
      {
        ...network,
        ...(compatibilityUrl ? {url: compatibilityUrl} : {}),
        networkID: `mina:${network.network}`,
      },
    ];
  });
}

export function findMatchingNetwork(
  networks: IAvailableNetworks,
  settings: INetworkOption | null,
): INetworkOption | null {
  if (!settings) {
    return null;
  }
  return (
    networks.find(network => network.apiUrl === settings.apiUrl) ||
    (settings.label && networks.find(network => network.label === settings.label)) ||
    (settings.name && networks.find(network => network.name === settings.name)) ||
    null
  );
}
