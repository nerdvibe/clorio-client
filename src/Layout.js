import React , { useState,useEffect } from "react";
import Sidebar from './components/General/Sidebar'
import {Container,Row,Col} from "react-bootstrap";
import Routes from './Routes';
import { clearSession, readSession } from './tools/auth'
import Spinner from "./components/General/Spinner";
import { useHistory } from "react-router-dom";

function Layout () {
  const [sessionData, setsessionData] = useState(undefined)
  const history = useHistory();

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
  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);
  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
    setsessionData(undefined)
    clearSession()
    history.push("/");
  };

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