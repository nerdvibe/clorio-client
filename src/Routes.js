import React,{useState} from "react";
import Overview from "./pages/Overview";
import SendTX from "./pages/SendTX";
import Stake from "./pages/Stake";
import {SplashScreen} from "./pages/SplashScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Entropy from "./pages/Entropy";
// import Verify from "./pages/Verify";
import { Route, Redirect, Switch } from "react-router-dom";
import Ledger from "./pages/Ledger";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
    {...rest}
    render={(props) => {
        if (rest.sessionData.address) {
          return <Component {...props} />;
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
  const {sessionData} = props
  return (
    <Switch>
      <ProtectedRoute exact path="/overview" component={Overview} sessionData={sessionData} />
      <ProtectedRoute exact path="/send-tx" component={SendTX} sessionData={sessionData} />
      <ProtectedRoute exact path="/stake" component={Stake} sessionData={sessionData} />
      <Route path="/login">
        <Login />
      </Route>
      {/*<Route path="/register">
        <Entropy />
      </Route>*/}
      <Route path="/register">
        <Register />
      </Route>
      {/*<Route path="/verify">
        <Verify />
      </Route>*/}
      <Route path="/ledger">
        <Ledger />
      </Route>
      <Route path="/">
        <SplashScreen />
      </Route>
    </Switch>
  );
}

export default Routes;