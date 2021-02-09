import React from "react";
import Overview from "./pages/Overview";
import SendTX from "./pages/SendTX";
import Stake from "./pages/Stake";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Entropy from "./pages/Entropy";
import Verify from "./pages/Verify";
import { Route, Redirect, Switch } from "react-router-dom";
import { useCookies } from "react-cookie";
import Authentication from "./tools";
import Ledger from "./pages/Ledger";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [cookies, setCookie] = useCookies(["isAuthenticated"]);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (cookies.isAuthenticated) {
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

function Routes() {
  return (
    <Switch>
      <ProtectedRoute exact path="/overview" component={Overview} />
      <ProtectedRoute exact path="/send-tx" component={SendTX} />
      <ProtectedRoute exact path="/stake" component={Stake} />
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Entropy />
      </Route>
      <Route path="/register-2">
        <Register />
      </Route>
      <Route path="/verify">
        <Verify />
      </Route>
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