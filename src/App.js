import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';
import Sidebar from './components/Sidebar'
import {Container,Row,Col} from "react-bootstrap";

import Overview from './pages/Overview';
import SendTX from './pages/SendTX';
import Stake from './pages/Stake';
import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import Entropy from './pages/Entropy';
import Verify from './pages/Verify';
import ProtectedRoute from './components/ProtectedRoute';
import Authentication from "./tools/auth";
import { useCookies,CookiesProvider } from 'react-cookie';

function App() {
    const [cookies, setCookie] = useCookies(['isAuthenticated']);
    console.log("🚀 ~ file: App.js ~ line 21 ~ App ~ cookies", cookies.isAuthenticated)
  return (
    <div className="App">
      <CookiesProvider>
      <Router>
        <Container fluid>
          <Row>
              {
                !!cookies.isAuthenticated && 
                <Col md={3} lg={2} xl={2} id="sidebar-wrapper">      
                  <Sidebar />
                </Col>
              }
              <Col id="page-content-wrapper">
                <Container className="contentWrapper animate__animated animate__fadeIn">
                  <Switch>
                    <ProtectedRoute exact path="/overview" component={Overview} />
                    <ProtectedRoute exact path="/send-tx" component={SendTX} />
                    <ProtectedRoute exact path="/stake" component={Stake} />
                    <Route path="/login">
                      <Login/>
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
                    <Route path="/">
                      <SplashScreen />
                    </Route>
                  </Switch>
                </Container>
              </Col> 
          </Row>
        </Container>
      </Router>
      </CookiesProvider>
    </div>
  );
}

export default App;
