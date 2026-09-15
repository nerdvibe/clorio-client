import {createContext, useContext, ReactNode} from 'react';
import {
  IAvailableNetworks,
  INetworkOption,
  NetworkSettingsInput,
  normalizeNetworkSettings,
  useNetworkSettings,
} from '../hooks/useNetworkSettings';

interface NetworkSettingsContextType {
  settings: INetworkOption | null;
  isInitialized: boolean;
  saveSettings: (settings: NetworkSettingsInput) => boolean;
  clearSettings: () => void;
  setAvailableNetworks: (networks: IAvailableNetworks) => void;
  availableNetworks: IAvailableNetworks;
}

const NetworkSettingsContext = createContext<NetworkSettingsContextType | undefined>(undefined);

export function NetworkSettingsProvider({children}: {children: ReactNode}) {
  const {
    settings,
    isInitialized,
    saveSettings,
    clearSettings,
    setAvailableNetworks,
    availableNetworks,
  } = useNetworkSettings();

  return (
    <NetworkSettingsContext.Provider
      value={{
        settings,
        isInitialized,
        saveSettings,
        clearSettings,
        setAvailableNetworks,
        availableNetworks,
      }}
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

export function formatNetworks(data: unknown): IAvailableNetworks {
  if (!data || typeof data !== 'object') {
    return [];
  }

  return Object.values(data).flatMap(value => {
    if (!value || typeof value !== 'object') {
      return [];
    }

    const input = value as Record<string, unknown>;
    let apiUrl = input.apiUrl;
    if (typeof apiUrl !== 'string' && typeof input.url === 'string') {
      try {
        // The published network list still uses the legacy node URL field.
        apiUrl = new URL(input.url).origin;
      } catch {
        return [];
      }
    }

    const network = normalizeNetworkSettings({...input, apiUrl});
    if (
      !network ||
      !network.network.trim() ||
      !network.label.trim() ||
      !network.name.trim()
    ) {
      return [];
    }
    return [
      {
        ...network,
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
