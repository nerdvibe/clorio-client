import type {QueryClient} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {normalizeApiUrl} from '../api/http';
import {queryClient} from '../api/queryClient';

export interface INetworkOption {
  apiUrl: string;
  network: string;
  label: string;
  name: string;
  epochUrl?: string;
  explorerUrl?: string;
  /** Apollo compatibility only; remove with Apollo in Task 10. */
  url?: string;
  networkID?: string;
}

export type NetworkOptionInput = Partial<INetworkOption>;
export type IAvailableNetworks = INetworkOption[];

type NetworkSettingsStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const copyString = (value: unknown): string => (typeof value === 'string' ? value : '');

export function normalizeNetworkSettings(value: unknown): INetworkOption | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const input = value as Record<string, unknown>;
  let apiUrl: string;
  try {
    if (Object.prototype.hasOwnProperty.call(input, 'apiUrl')) {
      apiUrl = normalizeApiUrl(input.apiUrl as string);
    } else {
      const legacyUrl = normalizeApiUrl(input.url as string);
      apiUrl = new URL(legacyUrl).origin;
    }
  } catch {
    return null;
  }

  const settings: INetworkOption = {
    apiUrl,
    network: copyString(input.network),
    label: copyString(input.label),
    name: copyString(input.name),
  };
  if (typeof input.epochUrl === 'string') {
    settings.epochUrl = input.epochUrl;
  }
  if (typeof input.explorerUrl === 'string') {
    settings.explorerUrl = input.explorerUrl;
  }
  return settings;
}

export const getEnvironmentNetworkSettings = (): INetworkOption | null =>
  normalizeNetworkSettings({
    apiUrl: import.meta.env.VITE_REACT_APP_API_SERVER,
    network: import.meta.env.VITE_REACT_APP_NETWORK,
    label: import.meta.env.VITE_REACT_APP_NETWORK,
    name: import.meta.env.VITE_REACT_APP_NETWORK,
    epochUrl: import.meta.env.VITE_REACT_APP_EPOCH_URL,
    explorerUrl: import.meta.env.VITE_REACT_APP_EXPLORER_URL,
  });

export function loadNetworkSettings(
  storage: NetworkSettingsStorage,
  fallback: INetworkOption | null = getEnvironmentNetworkSettings(),
): INetworkOption | null {
  const saved = storage.getItem('networkSettings');
  if (saved === null) {
    return fallback;
  }

  try {
    const settings = normalizeNetworkSettings(JSON.parse(saved));
    if (!settings) {
      return null;
    }
    const serialized = JSON.stringify(settings);
    if (serialized !== saved) {
      storage.setItem('networkSettings', serialized);
    }
    return settings;
  } catch {
    return null;
  }
}

export function saveNetworkSettings(
  storage: NetworkSettingsStorage,
  value: NetworkOptionInput,
): INetworkOption | null {
  const settings = normalizeNetworkSettings(value);
  if (!settings) {
    return null;
  }
  storage.setItem('networkSettings', JSON.stringify(settings));
  return settings;
}

export function removeOldNetworkQueries(
  client: QueryClient,
  previousApiUrl: string | undefined,
  nextApiUrl: string,
): void {
  if (!previousApiUrl || previousApiUrl === nextApiUrl) {
    return;
  }
  client.removeQueries({predicate: query => query.queryKey.includes(previousApiUrl)});
}

export function useNetworkSettings() {
  const [settings, setSettings] = useState<INetworkOption | null>(null);
  const [availableNetworks, setAvailableNetworks] = useState<IAvailableNetworks>([]);

  useEffect(() => {
    setSettings(loadNetworkSettings(localStorage));
  }, []);

  const saveSettings = (newSettings: NetworkOptionInput): boolean => {
    const normalized = saveNetworkSettings(localStorage, newSettings);
    if (!normalized) {
      return false;
    }
    removeOldNetworkQueries(queryClient, settings?.apiUrl, normalized.apiUrl);
    setSettings(normalized);
    return true;
  };

  const clearSettings = () => {
    localStorage.removeItem('networkSettings');
    setSettings(null);
  };

  return {settings, saveSettings, clearSettings, setAvailableNetworks, availableNetworks};
}
