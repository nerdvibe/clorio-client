import {useState} from 'react';
import {CustomSidebar} from './components/UI/sidebar/Sidebar';
import {Container} from 'react-bootstrap';
import Routes from './Routes';
import {storeNetworkData, isEmptyObject} from './tools';
import Spinner from './components/UI/Spinner';
import UserIDUpdater from './components/userIdUpdater/UserIDUpdater';
import {useQuery} from '@apollo/client';
import Alert from './components/UI/Alert';
import Balance from './components/balance/Balance';
import {GET_NETWORK} from './graphql/query';
import {TermsAndConditions} from './components/UI/modals';
import type {INetworkData} from './types';
import {useWallet} from './contexts/WalletContext';

const Layout = () => {
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const {updateWallet, wallet: sessionData} = useWallet();

  const {data: networkData} = useQuery<INetworkData>(GET_NETWORK, {
    onCompleted: async data => {
      if (data?.nodeInfo) {
        await storeNetworkData(data?.nodeInfo);
      }
    },
  });

  const toggleLoader = (state?: boolean) => {
    setShowLoader(state ? state : !showLoader);
  };

  const clearSessionData = () => {
    updateWallet({});
    setShowLoader(true);
  };
  const isAuthenticated = !!sessionData.address;

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
                isAuthenticated={isAuthenticated}
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
                <div
                  className={`flex gap-4 flex-col ${isAuthenticated ? 'authenticated-view' : ''}`}
                >
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
