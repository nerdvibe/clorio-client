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

function App() {
  return (
    <div className="App">
      <Router>
        <Container fluid>
          <Row>
              <Col md={3} lg={2} xl={2} id="sidebar-wrapper">      
                <Sidebar />
              </Col>
              <Col id="page-content-wrapper">
                <Container className="contentWrapper animate__animated animate__fadeIn">
                  <Switch>
                    <Route path="/send-tx">
                      <SendTX />
                    </Route>
                    <Route path="/overview">
                      <Overview />
                    </Route>
                    <Route path="/stake">
                      <Stake/>
                    </Route>
                    <Route path="/login">
                      <Login/>
                    </Route>
                    <Route path="/register">
                      <Register/>
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
    </div>
  );
}

export default App;
