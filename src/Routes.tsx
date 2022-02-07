import React, { Suspense } from "react";
const Overview = React.lazy(() => import("./pages/Overview"));
const SendTX = React.lazy(() => import("./pages/sendTX/SendTX"));
const Stake = React.lazy(() => import("./pages/stake/Stake"));
const SplashScreen = React.lazy(() => import("./pages/SplashScreen"));
const Login = React.lazy(() => import("./pages/Login"));
const LedgerLogin = React.lazy(() => import("./pages/LedgerLogin"));
const SignMessage = React.lazy(() => import("./pages/signMessage/SignMessage"));
const NotFound = React.lazy(() => import("./pages/404"));
const VerifyMessage = React.lazy(() => import("./pages/VerifyMessage"));
const Mnemonic = React.lazy(() => import("./pages/mnemonic/Mnemonic"));
const LoginSelection = React.lazy(
  () => import("./pages/loginSelection/LoginSelection")
);
import { AuthenticatedRoute } from "./components/routes/AuthenticatedRoute";
import { UnauthenticatedRoute } from "./components/routes/UnauthenticatedRoute";
import { INetworkData } from "./types/NetworkData";
import { IWalletData } from "./types/WalletData";
import { Route, Switch } from "react-router-dom";
import Spinner from "./components/UI/Spinner";

interface IRoutesProps {
  sessionData: IWalletData;
  network?: INetworkData;
  toggleLoader: (state?: boolean) => void;
}

const Routes = (props: IRoutesProps) => {
  return (
    <Suspense fallback={<Spinner show={true} />}>
      <Switch>
        <AuthenticatedRoute
          path="/overview"
          Component={Overview}
          appProps={props}
          isAuthenticated={!!props.sessionData.address}
        />
        <AuthenticatedRoute
          path="/send-tx"
          Component={SendTX}
          appProps={props}
          isAuthenticated={!!props.sessionData.address}
        />
        <AuthenticatedRoute
          path="/stake"
          Component={Stake}
          appProps={props}
          isAuthenticated={!!props.sessionData.address}
        />
        <AuthenticatedRoute
          path="/sign-message"
          Component={SignMessage}
          appProps={props}
          isAuthenticated={!!props.sessionData.address}
        />
        <AuthenticatedRoute
          path="/verify-message"
          Component={VerifyMessage}
          appProps={props}
          isAuthenticated={!!props.sessionData.address}
        />
        <UnauthenticatedRoute
          path="/login"
          Component={Login}
          appProps={props}
          isAuthenticated={!!props.sessionData.address}
        />
        <UnauthenticatedRoute
          path="/register"
          Component={Mnemonic}
          appProps={props}
          isAuthenticated={!!props.sessionData.address}
        />
        <UnauthenticatedRoute
          path="/ledger"
          Component={LedgerLogin}
          appProps={props}
          isAuthenticated={!!props.sessionData.address}
        />
        <UnauthenticatedRoute
          path="/ledger"
          Component={LedgerLogin}
          appProps={props}
          isAuthenticated={!!props.sessionData.address}
        />
        <UnauthenticatedRoute
          path="/login-selection"
          Component={LoginSelection}
          appProps={props}
          isAuthenticated={!!props.sessionData.address}
        />
        <UnauthenticatedRoute
          path="/"
          Component={SplashScreen}
          appProps={props}
          isAuthenticated={!!props.sessionData.address}
        />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
