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
import SignMessage from "./pages/SignMessage";
import NotFound from "./pages/404";
import VerifyMessage from "./pages/VerifyMessage";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
    {...rest}
    render={(props) => {
        if (rest.sessionData.address) {
          return <Component {...props} sessionData={rest.sessionData} />;
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
      <ProtectedRoute exact path="/overview" exact component={Overview} sessionData={sessionData} />
      <ProtectedRoute exact path="/send-tx" exact component={SendTX} sessionData={sessionData} />
      <ProtectedRoute exact path="/stake" exact component={Stake} sessionData={sessionData} />
      <ProtectedRoute exact path="/sign-message" exact component={SignMessage} sessionData={sessionData} />
      <ProtectedRoute exact path="/verify-message" exact component={VerifyMessage} sessionData={sessionData} />
      <Route path="/login" exact>
        <Login {...props}  network={props.network}/>
      </Route>
      {/*<Route path="/register">
        <Entropy />
      </Route>*/}
      <Route path="/register" exact>
        <Register {...props}  network={props.network}/>
      </Route>
      {/*<Route path="/verify">
        <Verify />
      </Route>*/}
      <Route path="/ledger" exact>
        <Ledger  network={props.network}/>
      </Route>
      <Route path="/" exact>
        <SplashScreen network={props.network}/>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default Routes;