import React, { Suspense } from "react";
const Overview = React.lazy(() => import("./pages/Overview"));
const SendTX = React.lazy(() => import("./pages/SendTX"));
const Stake = React.lazy(() => import("./pages/Stake"));
const SplashScreen = React.lazy(() => import("./pages/SplashScreen"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/register/Register"));
import { Route, Redirect, Switch } from "react-router-dom";
import Spinner from "./components/general/Spinner";
const LedgerLogin = React.lazy(() => import("./pages/LedgerLogin"));
const SignMessage = React.lazy(() => import("./pages/sign-message/SignMessage"));
const NotFound = React.lazy(() => import("./pages/404"));
const VerifyMessage = React.lazy(() => import("./pages/VerifyMessage"));
import { isEmptyObject } from "./tools/utils";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (
          rest.sessionData &&
          !isEmptyObject(rest.sessionData) &&
          rest.sessionData.address
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

function Routes(props) {
  const { sessionData } = props;
  return (
    <Suspense fallback={<Spinner show={true} />}>
      <Switch>
        <ProtectedRoute
          exact
          path="/overview"
          component={Overview}
          sessionData={sessionData}
          {...props}
        />
        <ProtectedRoute
          exact
          path="/send-tx"
          component={SendTX}
          sessionData={sessionData}
          {...props}
        />
        <ProtectedRoute
          exact
          path="/stake"
          component={Stake}
          sessionData={sessionData}
          {...props}
        />
        <ProtectedRoute
          exact
          path="/sign-message"
          component={SignMessage}
          sessionData={sessionData}
          {...props}
        />
        <ProtectedRoute
          exact
          path="/verify-message"
          component={VerifyMessage}
          sessionData={sessionData}
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
}

export default Routes;
