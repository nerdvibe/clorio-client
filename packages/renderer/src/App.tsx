import {HashRouter} from 'react-router-dom';
import Layout from './Layout';
import {ApolloProvider} from '@apollo/client';
import {LedgerContextProvider} from './contexts/ledger/LedgerContext';
import {apolloClient} from './graphql/api';
import 'react-loading-skeleton/dist/skeleton.css';
import './App.scss';
import {useNetworkSettingsContext} from './contexts/NetworkContext';
import {BalanceContextProvider} from './contexts/balance/BalanceContext';
import {useEffect} from 'react';
import {WalletProvider} from './contexts/WalletContext';
import {clearSession} from './tools';
import {networkState} from './store';
import {useRecoilState} from 'recoil';


function App() {
  const {settings, setAvailableNetworks, saveSettings} = useNetworkSettingsContext();
  const [{selectedNetwork, selectedNode}, setNetworkState] = useRecoilState(networkState);

  useEffect(() => {
    clearSession();
    getNetworks();
  }, []);

  const getNetworks = async () => {
    const hasInitialSettings = settings?.url;
    let data = await fetch(import.meta.env.VITE_REACT_APP_NETWORK_LIST)
      .then(response => response.json())
      .then(data => data);
    data = {...data, ...networkMock};
    if (data) {
      const newAvailableNetworks = Object.values(data).map(
        ({network, name}: {network: string; name: string}) => {
          return {chainId: network, name: name};
        },
      );
      setNetworkState(prev => ({
        ...prev,
        availableNetworks: newAvailableNetworks,
        showChangeNetworkModal: false,
      }));
      setAvailableNetworks(data);

      if (!selectedNetwork) {
        const defaultNetwork = Object.keys(data)[0];
        setNetworkState(prev => ({
          ...prev,
          selectedNetwork: {
            chainId: data[defaultNetwork].network,
            name: data[defaultNetwork].name,
          },
        }));
      }
      if (!hasInitialSettings) {
        const network = Object.keys(data)[0];
        saveSettings(data[network]);
        setNetworkState(prev => ({...prev, selectedNode: data[network]}));
      }
    }
  };

  return (
    <div className="App">
      <WalletProvider>
        <BalanceContextProvider>
          <ApolloProvider client={apolloClient(selectedNode!)}>
            <LedgerContextProvider>
              <HashRouter>
                <Layout />
              </HashRouter>
            </LedgerContextProvider>
          </ApolloProvider>
        </BalanceContextProvider>
      </WalletProvider>
    </div>
  );
}

export default App;
