import React , { useState } from "react";
import Sidebar from './components/General/Sidebar'
import {Container,Row,Col} from "react-bootstrap";
import Routes from './Routes';
import { clearSession, readSession } from './tools/auth'
import Spinner from "./components/General/Spinner";
import { useHistory } from "react-router-dom";
import UpdateUserID from "./components/UpdateUserID";
import { gql, useQuery } from "@apollo/client";

const GET_NETWORK = gql`
  query NodeInfo {
    nodeInfo {
      height
      name
      network
      version
    }
  }
`

function Layout () {
  const [sessionData, setsessionData] = useState(undefined)
  const history = useHistory();
  const network = useQuery(GET_NETWORK);

  const goToHome = () => {
    history.push("/");
  }
  
  readSession((data) => {
      if(!sessionData){
          setsessionData(data)
      }
  },goToHome)

  const setLoader = () => {
    setsessionData(undefined)
  }
  
  window.onbeforeunload = () => {
    clearSession()
    setsessionData(undefined)
  }

  return (
    <div>
      <Container fluid>
        <Row>
          {!!sessionData && sessionData.address && (
            <Col md={3} lg={2} xl={2} id="sidebar-wrapper">
              <Sidebar setLoader={setLoader} network={network.data}/>
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
      <UpdateUserID sessionData={sessionData} />
      </Container>
    </div>
  );
}

export default Layout;