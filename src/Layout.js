import React , { useState,useEffect } from "react";
import Sidebar from './components/General/Sidebar'
import {Container,Row,Col} from "react-bootstrap";
import Routes from './Routes';
import { readSession } from './tools/auth'
import Spinner from "./components/General/Spinner";

function Layout () {
  const [sessionData, setsessionData] = useState(undefined)
  console.log("🚀 ~ file: Layout.js ~ line 10 ~ Layout ~ sessionData", sessionData)
  readSession((data) => {
      if(!sessionData){
          setsessionData(data)
      }
  })

  const setLoader = () => {
    setsessionData(undefined)
  }

  return (
    <div>
      <Container fluid>
        <Row>
          {!!sessionData && sessionData.address && (
            <Col md={3} lg={2} xl={2} id="sidebar-wrapper">
              <Sidebar setLoader={setLoader} />
            </Col>
          )}
          <Col id="page-content-wrapper">
            <Container className="contentWrapper animate__animated animate__fadeIn">
              <Spinner show={!sessionData}>
                <Routes sessionData={sessionData} setLoader={setLoader}/>
              </Spinner>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Layout;