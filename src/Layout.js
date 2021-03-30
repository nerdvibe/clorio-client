import { useState } from "react";
import Sidebar from "./components/General/sidebar/Sidebar";
import { Col, Container, Row } from "react-bootstrap";
import Routes from "./Routes";
import { clearSession, readSession, storeNetworkData } from "./tools/auth";
import Spinner from "./components/General/Spinner";
import { useHistory } from "react-router-dom";
import UpdateUserID from "./components/General/UpdateUserID";
import { useQuery } from "@apollo/client";
import { isEmptyObject } from "./tools/utils";
import Alert from "./components/General/Alert";
import Wallet from "./components/General/wallet/Wallet";
import { BalanceContextProvider } from "./context/BalanceContext";
import { GET_NETWORK } from "./graphql/query";
import { useContext } from "react";
import { LedgerContext } from "./context/LedgerContext";
import { TermsAndConditions } from "./components/Modals/TermsAndConditions";

const Layout = () => {
  const [sessionData, setSessionData] = useState(undefined);
  const [showLoader, setShowLoader] = useState(false);
  const { setLedgerContext } = useContext(LedgerContext);
  const history = useHistory();
  const network = useQuery(GET_NETWORK, {
    onCompleted: async (data) => {
      if (data?.nodeInfo) {
        await storeNetworkData(data?.nodeInfo);
      }
    },
  });

  const goToHome = () => {
    history.push("/");
  };

  readSession((data) => {
    if (!sessionData) {
      setSessionData(data);
      if(setLedgerContext){
        setLedgerContext({
          ledger:data.ledger,
          ledgerAccount: data.ledgerAccount
        })
      }
    }
  }, goToHome);

  const setLoader = () => {
    setSessionData(undefined);
  };

  window.onbeforeunload = () => {
    clearSession();
    setSessionData(undefined);
  };

  return (
    <div>
      <Container fluid>
        <TermsAndConditions />
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
                  {sessionData &&
                    !isEmptyObject(sessionData) &&
                    sessionData.address && <Wallet />}
                  <Routes
                    sessionData={sessionData}
                    setLoader={setLoader}
                    network={network.data}
                    toggleLoader={setShowLoader}
                  />
                </Spinner>
              </BalanceContextProvider>
            </Container>
          </Col>
        </Row>
        <Alert />
        <UpdateUserID sessionData={sessionData} />
      </Container>
    </div>
  );
}

export default Layout;
