import React, { Suspense } from "react";
const Overview = React.lazy(() => import("./pages/Overview"));
const SendTX = React.lazy(() => import("./pages/sendTX/SendTX"));
const Stake = React.lazy(() => import("./pages/stake/Stake"));
const SplashScreen = React.lazy(() => import("./pages/SplashScreen"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/registration/Registration"));
import { Route, Redirect, Switch } from "react-router-dom";
import Spinner from "./components/UI/Spinner";
const LedgerLogin = React.lazy(() => import("./pages/LedgerLogin"));
const SignMessage = React.lazy(() => import("./pages/signMessage/SignMessage"));
const NotFound = React.lazy(() => import("./pages/404"));
const VerifyMessage = React.lazy(() => import("./pages/VerifyMessage"));
import { isEmptyObject } from "./tools/utils";
import { INetworkData } from "./types/NetworkData";
import { IWalletData } from "./types/WalletData";

interface IProtectedRouteProps {
  component: React.FC<any>;
  [key: string]: any;
}

interface IRoutesProps {
  sessionData: IWalletData;
  network?: INetworkData;
  toggleLoader: (state?: boolean) => void;
}

const ProtectedRoute = ({
  component: Component,
  ...rest
}: IProtectedRouteProps) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (
          rest.sessionData &&
          !isEmptyObject(rest.sessionData) &&
          rest.sessionData?.address
        ) {
          return (
            <Component {...props} {...rest} sessionData={rest.sessionData} />
          );
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

const Routes = (props: IRoutesProps) => {
  return (
    <Suspense fallback={<Spinner show={true} />}>
      <Switch>
        <ProtectedRoute
          exact
          path="/overview"
          component={Overview}
          {...props}
        />
        <ProtectedRoute exact path="/send-tx" component={SendTX} {...props} />
        <ProtectedRoute exact path="/stake" component={Stake} {...props} />
        <ProtectedRoute
          exact
          path="/sign-message"
          component={SignMessage}
          {...props}
        />
        <ProtectedRoute
          exact
          path="/verify-message"
          component={VerifyMessage}
          {...props}
        />
        <Route path="/login" exact>
          <Login {...props} network={props.network} />
        </Route>
        <Route path="/register" exact>
          <Register {...props} network={props.network} />
        </Route>
        <Route path="/ledger" exact>
          <LedgerLogin {...props} network={props.network} />
        </Route>
        {/*<Route path="/register">
          <Entropy />
        </Route>*/}
        {/*<Route path="/verify">
          <VerifyMnemonic />
        </Route>*/}
        <Route path="/" exact>
          <SplashScreen network={props.network} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
