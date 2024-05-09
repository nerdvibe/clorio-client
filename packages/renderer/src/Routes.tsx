import {Suspense, lazy} from 'react';
const Overview = lazy(() => import('./pages/Overview'));
const SendTX = lazy(() => import('./pages/sendTX/SendTX'));
const Stake = lazy(() => import('./pages/stake/Stake'));
const SplashScreen = lazy(() => import('./pages/SplashScreen'));
const Login = lazy(() => import('./pages/Login'));
const LedgerLogin = lazy(() => import('./pages/LedgerLogin'));
const SignMessage = lazy(() => import('./pages/signMessage/SignMessage'));
const NotFound = lazy(() => import('./pages/404'));
const VerifyMessage = lazy(() => import('./pages/VerifyMessage'));
const Mnemonic = lazy(() => import('./pages/mnemonic/Mnemonic'));
const LoginSelection = lazy(() => import('./pages/loginSelection/LoginSelection'));
const ZkApps = lazy(() => import('./pages/ZkApps'));
import {Routes as AppRoutes, Navigate, Route} from 'react-router-dom';
import Spinner from './components/UI/Spinner';
import type {INetworkData, IWalletData} from './types';

interface IRoutesProps {
  sessionData: IWalletData;
  network?: INetworkData;
  toggleLoader: (state?: boolean) => void;
}

const Routes = (props: IRoutesProps) => {
  const isAuthenticated = props.sessionData.address;

  return (
    <Suspense fallback={<Spinner show={true} />}>
      <AppRoutes>
        <Route
          path="/overview"
          element={isAuthenticated ? <Overview {...props} /> : <Navigate to="/" />}
        />
        <Route
          path="/send-tx"
          element={isAuthenticated ? <SendTX {...props} /> : <Navigate to="/" />}
        />
        <Route
          path="/stake"
          element={isAuthenticated ? <Stake {...props} /> : <Navigate to="/" />}
        />
        <Route
          path="/sign-message"
          element={isAuthenticated ? <SignMessage {...props} /> : <Navigate to="/" />}
        />
        <Route
          path="/verify-message"
          element={isAuthenticated ? <VerifyMessage {...props} /> : <Navigate to="/" />}
        />
        <Route
          path="/zkapps"
          element={isAuthenticated ? <ZkApps {...props} /> : <Navigate to="/" />}
        />

        <Route
          path="/login"
          element={!isAuthenticated ? <Login {...props} /> : <Navigate to="/overview" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Mnemonic {...props} /> : <Navigate to="/overview" />}
        />
        <Route
          path="/ledger"
          element={!isAuthenticated ? <LedgerLogin {...props} /> : <Navigate to="/overview" />}
        />
        <Route
          path="/login-selection"
          element={!isAuthenticated ? <LoginSelection /> : <Navigate to="/overview" />}
        />
        <Route
          path="/"
          element={!isAuthenticated ? <SplashScreen {...props} /> : <Navigate to="/overview" />}
        />
        <Route element={<NotFound />} />
      </AppRoutes>
    </Suspense>
  );
};

export default Routes;
