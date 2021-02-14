import React , { useState } from "react";
import Sidebar from './components/General/Sidebar'
import {Container,Row,Col} from "react-bootstrap";
import Routes from './Routes';
import { readSession } from './tools/auth'
import Spinner from "./components/General/Spinner";

function Layout () {
  const [sessionData, setsessionData] = useState({empty:true})
  readSession((data) => {
      if(sessionData.empty){
          setsessionData(data)
      }
  })
  return (
    <div>
      <Container fluid>
        <Row>
          {!!sessionData && sessionData.address && (
            <Col md={3} lg={2} xl={2} id="sidebar-wrapper">
              <Sidebar />
            </Col>
          )}
          <Col id="page-content-wrapper">
            <Container className="contentWrapper animate__animated animate__fadeIn">
              <Spinner show={sessionData.empty}>
                <Routes sessionData={sessionData}/>
              </Spinner>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Layout;