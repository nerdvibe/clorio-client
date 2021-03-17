import React, { useState } from "react";
import Sidebar from "./components/General/Sidebar";
import { Container, Row, Col } from "react-bootstrap";
import Routes from "./Routes";
import { clearSession, readSession } from "./tools/auth";
import Spinner from "./components/General/Spinner";
import { useHistory } from "react-router-dom";
import UpdateUserID from "./components/General/UpdateUserID";
import { gql, useQuery } from "@apollo/client";
import { isEmptyObject } from "./tools/utils";
import Alert from "./components/General/Alert";
import Wallet from "./components/General/Wallet";
import {BalanceContextProvider} from "./context/BalanceContext";

const GET_NETWORK = gql`
  query NodeInfo {
    nodeInfo {
      height
      name
      network
      version
    }
  }
`;

function Layout() {
  const [sessionData, setsessionData] = useState(undefined);
  const [showLoader, setShowLoader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertStyle, setAlertStyle] = useState("error-toast");
  const history = useHistory();
  const network = useQuery(GET_NETWORK);

  const goToHome = () => {
    history.push("/");
  };

  readSession((data) => {
    if (!sessionData) {
      setsessionData(data);
    }
  }, goToHome);

  const setLoader = () => {
    setsessionData(undefined);
  };

  window.onbeforeunload = () => {
    clearSession();
    setsessionData(undefined);
  };

  function showGlobalAlert(text, style) {
    setAlertText(text);
    setAlertStyle(style);
    setShowAlert(true);
  }

  return (
    <div>
      <Container fluid>
        <Row>
          {sessionData && !isEmptyObject(sessionData) && sessionData.address && (
            <Col md={3} lg={3} xl={2} id="sidebar-wrapper">
              <Sidebar setLoader={setLoader} network={network.data} />
            </Col>
          )}
          {}
          <Col
            className={
              isEmptyObject(sessionData)
                ? "page-content-wrapper"
                : "page-content-wrapper-scrollable"
            }
          >
            <Container className="contentWrapper animate__animated animate__fadeIn">
              <BalanceContextProvider>
                <Spinner show={!sessionData || showLoader}>
                  {sessionData && !isEmptyObject(sessionData) && sessionData.address && (
                    <Wallet />
                  )}
                  <Routes
                    sessionData={sessionData}
                    setLoader={setLoader}
                    network={network.data}
                    toggleLoader={setShowLoader}
                    showGlobalAlert={showGlobalAlert}
                  />
                </Spinner>
              </BalanceContextProvider>
            </Container>
          </Col>
        </Row>
        <Alert
          show={showAlert}
          hideToast={() => setShowAlert(false)}
          type={alertStyle}
        >
          {alertText}
        </Alert>
        <UpdateUserID sessionData={sessionData} />
      </Container>
    </div>
  );
}

export default Layout;
