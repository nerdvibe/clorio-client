import React from "react";
import Sidebar from './components/General/Sidebar'
import {Container,Row,Col} from "react-bootstrap";
import Routes from './Routes';
import { useCookies } from 'react-cookie';

function Layout () {
  const [cookies, setCookie] = useCookies(["isAuthenticated"]);
  return (
    <div>
      <Container fluid>
        <Row>
          {!!cookies.isAuthenticated && (
            <Col md={3} lg={2} xl={2} id="sidebar-wrapper">
              <Sidebar />
            </Col>
          )}
          <Col id="page-content-wrapper">
            <Container className="contentWrapper animate__animated animate__fadeIn">
              <Routes />
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Layout;