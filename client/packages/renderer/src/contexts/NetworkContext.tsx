import {createContext, useContext, ReactNode} from 'react';
import {IAvailableNetworks, INetworkOption, useNetworkSettings} from '../hooks/useNetworkSettings';

interface NetworkSettingsContextType {
  settings: INetworkOption | null;
  saveSettings: (settings: INetworkOption) => void;
  clearSettings: () => void;
  setAvailableNetworks: (networks: IAvailableNetworks) => void;
  availableNetworks: IAvailableNetworks | null;
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
