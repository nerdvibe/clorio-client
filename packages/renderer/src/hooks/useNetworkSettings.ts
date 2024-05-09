// useNetworkSettings.tsx
import {useEffect, useState} from 'react';

export interface IAvailableNetworks {
  [network: string]: INetworkOption;
}

export interface INetworkOption {
  url: string;
  network: string;
  label: string;
  name: string;
  epochUrl: string;
  explorerUrl: string;
}

const initialAvailableNetworks: IAvailableNetworks = {
  [import.meta.env.VITE_REACT_APP_NETWORK as string]: {
    url: import.meta.env.VITE_REACT_APP_GQL_SERVER || '',
    network: import.meta.env.VITE_REACT_APP_NETWORK || '',
    label: import.meta.env.VITE_REACT_APP_NETWORK || '',
    name: import.meta.env.VITE_REACT_APP_NETWORK || '',
    epochUrl: import.meta.env.VITE_REACT_APP_EPOCH_URL || '',
    explorerUrl: import.meta.env.VITE_REACT_APP_EXPLORER_URL || '',
  },
};

export function useNetworkSettings() {
  const [settings, setSettings] = useState<INetworkOption | null>(null);
  const [availableNetworks, setAvailableNetworks] = useState<IAvailableNetworks | null>(
    initialAvailableNetworks,
  );

  useEffect(() => {
    // Try to load settings from local storage when the component mounts
    const savedSettings = localStorage.getItem('networkSettings');

    if (savedSettings) {
      // If settings are found in local storage, use them
      setSettings(JSON.parse(savedSettings));
    } else {
      // If no settings are found, set environment variables as defaults
      setSettings({
        url: import.meta.env.VITE_REACT_APP_GQL_SERVER || '',
        network: import.meta.env.VITE_REACT_APP_NETWORK || '',
        label: import.meta.env.VITE_REACT_APP_NETWORK || '',
        epochUrl: import.meta.env.VITE_REACT_APP_EPOCH_URL || '',
        explorerUrl: import.meta.env.VITE_REACT_APP_EXPLORER_URL || '',
        name: import.meta.env.VITE_REACT_APP_NETWORK || '',
      });
    }
  }, []);

  const saveSettings = (newSettings: INetworkOption) => {
    // Save settings to local storage
    localStorage.setItem('networkSettings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const clearSettings = () => {
    // Clear settings from local storage
    localStorage.removeItem('networkSettings');
    setSettings(null);
  };

  return {settings, saveSettings, clearSettings, setAvailableNetworks, availableNetworks};
}
