import {useEffect, useState} from 'react';
import {CustomSidebar} from './components/UI/sidebar/Sidebar';
import {Container} from 'react-bootstrap';
import Routes from './Routes';
import {readSession, storeNetworkData, isEmptyObject} from './tools';
import Spinner from './components/UI/Spinner';
import UserIDUpdater from './components/userIdUpdater/UserIDUpdater';
import {useQuery} from '@apollo/client';
import Alert from './components/UI/Alert';
import Balance from './components/balance/Balance';
import {GET_NETWORK} from './graphql/query';
import {useContext} from 'react';
import {TermsAndConditions} from './components/UI/modals';
import {LedgerContext} from './contexts/ledger/LedgerContext';
import type {ILedgerContext} from './contexts/ledger/LedgerTypes';
import {BalanceContextProvider} from './contexts/balance/BalanceContext';
import type {IWalletData} from './types/WalletData';
import type {INetworkData} from './types';
import {useNavigate} from 'react-router-dom';
import { useWallet } from './contexts/WalletContext';

const initialSessionData = {
  address: '',
  id: -1,
  ledger: false,
  ledgerAccount: 0,
  type: 'wallet',
  mnemonic: false,
};

const Layout = () => {
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const {setLedgerContext} = useContext<Partial<ILedgerContext>>(LedgerContext);
  const {updateWallet, wallet:sessionData} = useWallet();
  
  const {data: networkData} = useQuery<INetworkData>(GET_NETWORK, {
    onCompleted: async data => {
      if (data?.nodeInfo) {
        await storeNetworkData(data?.nodeInfo);
      }
    },
  });

  const goToHome = () => {
    navigate({
      pathname: '/overview',
    });
  };


  const toggleLoader = (state?: boolean) => {
    setShowLoader(state ? state : !showLoader);
  };

  const clearSessionData = () => {
    updateWallet({});
    setShowLoader(true);
  };

  return (
    <div>
      <Container fluid>
        <TermsAndConditions />
        <div className="flex items-stretch">
          {sessionData && !isEmptyObject(sessionData) && sessionData.address && (
            <>
              <CustomSidebar
                mnemonic={sessionData.mnemonic}
                toggleLoader={toggleLoader}
                network={networkData}
                clearSessionData={clearSessionData}
              />
              <UserIDUpdater />
            </>
          )}
          <div
            className={
              isEmptyObject(sessionData)
                ? 'page-content-wrapper'
                : 'page-content-wrapper-scrollable'
            }
          >
            <Container className="contentWrapper animate__animated animate__fadeIn">
              <Spinner show={showLoader}>
                <div className="flex gap-4 flex-col">
                  {sessionData && !isEmptyObject(sessionData) && sessionData.address && <Balance />}
                  <Routes
                    sessionData={sessionData}
                    toggleLoader={toggleLoader}
                    network={networkData}
                  />
                </div>
              </Spinner>
            </Container>
          </div>
        </div>
        <Alert />
      </Container>
    </div>
  );
};

export default Layout;
