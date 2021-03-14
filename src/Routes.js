import React from "react";
import Overview from "./pages/Overview";
import SendTX from "./pages/SendTX";
import Stake from "./pages/Stake";
import { SplashScreen } from "./pages/SplashScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Route, Redirect, Switch } from "react-router-dom";
import Ledger from "./pages/Ledger";
import SignMessage from "./pages/SignMessage";
import NotFound from "./pages/404";
import VerifyMessage from "./pages/VerifyMessage";
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
    <Switch>
      <ProtectedRoute
        exact
        path="/overview"
        component={Overview}
        sessionData={sessionData}
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
      />
      <ProtectedRoute
        exact
        path="/verify-message"
        component={VerifyMessage}
        sessionData={sessionData}
      />
      <Route path="/login" exact>
        <Login {...props} network={props.network} />
      </Route>
      <Route path="/register" exact>
        <Register {...props} network={props.network} />
      </Route>
      <Route path="/ledger" exact>
        <Ledger {...props} network={props.network} />
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
  );
}

export default Routes;
