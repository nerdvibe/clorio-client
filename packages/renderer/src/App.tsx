import {HashRouter} from 'react-router-dom';
import Layout from './Layout';
import {QueryClientProvider} from '@tanstack/react-query';
import {LedgerContextProvider} from './contexts/ledger/LedgerContext';
import 'react-loading-skeleton/dist/skeleton.css';
import './App.scss';
import {
  findMatchingNetwork,
  formatNetworks,
  useNetworkSettingsContext,
} from './contexts/NetworkContext';
import type {INetworkOption} from './hooks/useNetworkSettings';
import {BalanceContextProvider} from './contexts/balance/BalanceContext';
import {useEffect, useState} from 'react';

import {clearSession} from './tools';
import {networkState} from './store';
import {useRecoilState} from 'recoil';
import * as React from 'react';
import {queryClient} from './api/queryClient';

// Dynamic import for DevTools to avoid build errors if the folder is ignored/missing
const DevTools = React.lazy(() =>
  import('./dev-tools/DevTools').catch(() => ({default: () => null})),
);

const networkFallback = (settings: INetworkOption): INetworkOption => {
  const network = settings.network.trim() || 'custom';
  const label = settings.label.trim() || network;
  return {
    ...settings,
    network,
    label,
    name: settings.name.trim() || label,
  };
};

function App() {
  const {settings, isInitialized, setAvailableNetworks, saveSettings} =
    useNetworkSettingsContext();
  const [{selectedNetwork}, setNetworkState] = useRecoilState(networkState);
  const [networksReady, setNetworksReady] = useState(false);

  const activeNetwork = networksReady && settings ? settings : null;
  const showConfigurationState = isInitialized && networksReady && !activeNetwork;

  useEffect(() => {
    clearSession();
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (!settings) {
      setNetworksReady(true);
      return;
    }

    getNetworks(settings);
  }, [isInitialized, settings]);

  const selectDefaultNetwork = (networks: string[]) => {
    if (networks.includes('mainnet')) {
      return 'mainnet';
    } else if (networks.includes('devnet')) {
      return 'devnet';
    } else {
      return networks[0];
    }
  };

  const getNetworks = async (currentSettings: INetworkOption) => {
    setNetworksReady(false);
    const networkListUrl = import.meta.env.VITE_REACT_APP_NETWORK_LIST;
    if (!networkListUrl) {
      setNetworksReady(true);
      return;
    }
    let data: unknown;
    try {
      const response = await fetch(networkListUrl);
      if (response.ok === false) throw new Error(`Network list request failed: ${response.status}`);
      data = await response.json();
    } catch {
      const fallback = networkFallback(currentSettings);
      setAvailableNetworks([fallback]);
      setNetworkState(prev => ({
        ...prev,
        availableNetworks: [{chainId: fallback.network, name: fallback.name}],
        selectedNode: fallback,
      }));
      setNetworksReady(true);
      return;
    }
    if (data) {
      const remoteNetworks = formatNetworks(data);
      // Keep the active network selectable when the optional network-list service
      // is unavailable or temporarily returns an empty payload.
      const formattedNetworks = remoteNetworks.length
        ? remoteNetworks
        : [networkFallback(currentSettings)];
      const newAvailableNetworks = Object.values(formattedNetworks).map(
        ({network, name}: {network: string; name: string}) => {
          return {chainId: network, name: name, networkID: `mina:${network}`};
        },
      );
      setNetworkState(prev => ({
        ...prev,
        availableNetworks: newAvailableNetworks,
        showChangeNetworkModal: false,
      }));
      setAvailableNetworks(formattedNetworks);

      const matchingNetwork = findMatchingNetwork(formattedNetworks, currentSettings);

      if (matchingNetwork) {
        if (
          matchingNetwork.apiUrl !== currentSettings.apiUrl &&
          !saveSettings(matchingNetwork)
        ) {
          setNetworksReady(true);
          return;
        }
        setNetworkState(prev => ({
          ...prev,
          selectedNode: matchingNetwork,
          selectedNetwork: {
            chainId: matchingNetwork.network || '',
            name: matchingNetwork.name || matchingNetwork.label || '',
            networkID: `mina:${matchingNetwork.network || ''}`,
          },
        }));
        setNetworksReady(true);
        return;
      }

      const defaultNetworkName = selectDefaultNetwork(
        formattedNetworks.map(({label}) => label),
      );
      const defaultNetwork =
        formattedNetworks.find(({label}) => label === defaultNetworkName) || formattedNetworks[0];
      if (!defaultNetwork) {
        setNetworksReady(true);
        return;
      }

      if (!selectedNetwork) {
        setNetworkState(prev => ({
          ...prev,
          selectedNetwork: {
            chainId: defaultNetwork.network,
            name: defaultNetwork.name,
            networkID: `mina:${defaultNetwork.network}`,
          },
        }));
      }

      saveSettings(defaultNetwork);
      setNetworkState(prev => ({...prev, selectedNode: defaultNetwork}));
      setNetworksReady(true);
      return;
    }

    setNetworksReady(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <BalanceContextProvider>
          <React.Suspense fallback={null}>
            <DevTools />
          </React.Suspense>
          {activeNetwork ? (
            <LedgerContextProvider>
              <HashRouter>
                <Layout />
              </HashRouter>
            </LedgerContextProvider>
          ) : showConfigurationState ? (
            <main
              role="alert"
              aria-labelledby="network-configuration-heading"
            >
              <h1 id="network-configuration-heading">Network configuration required</h1>
              <p>Configure a valid REST API URL before using the wallet.</p>
            </main>
          ) : null}
        </BalanceContextProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;
