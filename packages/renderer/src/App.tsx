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

function App() {
  const {settings, setAvailableNetworks, saveSettings} = useNetworkSettingsContext();
  useEffect(() => {
    getNetworks();
  }, []);

  const getNetworks = async () => {
    const hasInitialSettings = settings?.url;
    const data = await fetch(import.meta.env.VITE_REACT_APP_NETWORK_LIST)
      .then(response => response.json())
      .then(data => data);
    if (data) {
      setAvailableNetworks(data);
      if (!hasInitialSettings) {
        const network = Object.keys(data)[0];
        saveSettings(data[network]);
      }
    }
  };
  return (
    <div className="App">
      <WalletProvider>
        <BalanceContextProvider>
          <ApolloProvider client={apolloClient(settings)}>
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
