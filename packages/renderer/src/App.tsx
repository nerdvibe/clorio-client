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
import {Button} from 'react-bootstrap';
import {networkState} from './store';
import {useRecoilState} from 'recoil';

function App() {
  const {settings, setAvailableNetworks, saveSettings} = useNetworkSettingsContext();
  const [{selectedNetwork}, setNetworkState] = useRecoilState(networkState);

  useEffect(() => {
    clearSession();
    getNetworks();
  }, []);

  const getNetworks = async () => {
    const hasInitialSettings = settings?.url;
    const data = await fetch(import.meta.env.VITE_REACT_APP_NETWORK_LIST)
      .then(response => response.json())
      .then(data => data);
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
      }
    }
  };

  return (
    <div className="App">
      <Button
        style={{position: 'absolute', zIndex: 9999}}
        onClick={() => {
          (window.ipcBridge as any).invoke(
            'open-win',
            JSON.stringify({
              text: '',
              url: 'http://localhost:8080/',
            }),
          );
        }}
      >
        OPEN WORDLE
      </Button>
      <WalletProvider>
        <BalanceContextProvider>
          <ApolloProvider client={apolloClient(settings!)}>
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
