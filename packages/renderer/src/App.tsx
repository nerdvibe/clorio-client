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

// TODO: REMOVE BEFORE PUSH
const networkMock = {
  mainnet: {
    name: 'Mainnet',
    url: 'https://clorio-mina-main01.clor.io/v1/graphql',
    network: 'mainnet',
    label: 'Mainnet',
    explorerUrl: 'https://minaexplorer.com/',
    hideValidators: false,
  },
  devnet: {
    name: 'Devnet',
    url: 'https://clorio-mina-dev01.clor.io/v1/graphql',
    network: 'testnet',
    label: 'Devnet',
    explorerUrl: 'https://devnet.minaexplorer.com/',
    hideValidators: true,
  },
};

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
      <Button
        style={{position: 'absolute', zIndex: 9999}}
        onClick={() => {
          (window.ipcBridge as any).invoke(
            'open-win',
            JSON.stringify({
              text: '',
              // url: 'https://zk-voting-web-app.vercel.app/',
              // url: 'https://mina-z-knoid-web.vercel.app/',
              // url: 'https://minapolis.vercel.app/',
              // url: 'http://localhost:8080/',
              // url: 'http://localhost:3001/',
              // url: 'https://dcspark.github.io/zkapp-nonogram/',
              // url: 'https://mina-wordle.juxdan.io/',
              url: 'https://test-zkapp.aurowallet.com/',
            }),
          );
        }}
      >
        OPEN WORDLE
      </Button>
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
