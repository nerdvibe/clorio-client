import React , { useState } from "react";
import Sidebar from './components/General/Sidebar'
import {Container,Row,Col} from "react-bootstrap";
import Routes from './Routes';
import { readSession } from './tools/auth'
import Spinner from "./components/General/Spinner";

function Layout () {
  const [sessionData, setsessionData] = useState({empty:true})
  const privateKey = "aBUiadiaU219xSN8hska3j1ii3012i319jijdj1LLasdo";
  const passphrase = "witch collapse practice feed shame open despair creek road again ice least";
  readSession((data) => {
      console.log("🚀 ~ file: Layout.js ~ line 13 ~ readSession ~ data", data)
      if(sessionData.empty){
          setsessionData(data)
          console.log("🚀 ~ file: Layout.js ~ line 16 ~ readSession ~ sessionData", sessionData)
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