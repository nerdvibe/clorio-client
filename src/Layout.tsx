import { useEffect, useState } from "react";
import Sidebar from "./components/UI/sidebar/Sidebar";
import { Col, Container, Row } from "react-bootstrap";
import Routes from "./Routes";
import {
  clearSession,
  readSession,
  storeNetworkData,
  isEmptyObject,
} from "./tools";
import Spinner from "./components/UI/Spinner";
import { useHistory } from "react-router-dom";
import UserIDUpdater from "./components/userIdUpdater/UserIDUpdater";
import { useQuery } from "@apollo/client";
import Alert from "./components/UI/Alert";
import Balance from "./components/balance/Balance";
import { GET_NETWORK } from "./graphql/query";
import { useContext } from "react";
import { TermsAndConditions } from "./components/UI/modals";
import { LedgerContext } from "./contexts/ledger/LedgerContext";
import { ILedgerContext } from "./contexts/ledger/LedgerTypes";
import { BalanceContextProvider } from "./contexts/balance/BalanceContext";
import { IWalletData } from "./types/WalletData";
import { INetworkData } from "./types";

const initialSessionData = {
  address: "",
  id: -1,
  ledger: false,
  ledgerAccount: 0,
  type: "wallet",
};

const Layout = () => {
  const history = useHistory();
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<IWalletData>(
    initialSessionData
  );
  const { setLedgerContext } = useContext<Partial<ILedgerContext>>(
    LedgerContext
  );
  const { data: networkData } = useQuery<INetworkData>(GET_NETWORK, {
    onCompleted: async (data) => {
      if (data?.nodeInfo) {
        await storeNetworkData(data?.nodeInfo);
      }
    },
  });

  const goToHome = () => {
    history.replace({
      pathname: "/overview",
    });
  };

  useEffect(() => {
    const readAndSetSession = async () => {
      const data = await readSession();
      if (data) {
        setSessionData(data);
        if (setLedgerContext) {
          setLedgerContext({
            ledger: data.ledger,
            ledgerAccount: data.ledgerAccount,
          });
        }
        goToHome();
      }
      setShowLoader(false);
    };

    if (showLoader) {
      readAndSetSession();
    }
  });

  const toggleLoader = (state?: boolean) => {
    setShowLoader(state ? state : !showLoader);
  };

  const clearSessionData = () => {
    setSessionData(initialSessionData);
    setShowLoader(true);
  };

  window.onbeforeunload = () => {
    clearSession();
    setSessionData(initialSessionData);
  };

  return (
    <div>
      <Container fluid>
        <TermsAndConditions />
        <Row>
          {sessionData && !isEmptyObject(sessionData) && sessionData.address && (
            <Col md={3} lg={3} xl={2} id="sidebar-wrapper">
              <Sidebar
                toggleLoader={toggleLoader}
                network={networkData}
                clearSessionData={clearSessionData}
              />
              <UserIDUpdater sessionData={sessionData} />
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
                <Spinner show={showLoader}>
                  <div>
                    {sessionData &&
                      !isEmptyObject(sessionData) &&
                      sessionData.address && <Balance />}
                    <Routes
                      sessionData={sessionData}
                      toggleLoader={toggleLoader}
                      network={networkData}
                    />
                  </div>
                </Spinner>
              </BalanceContextProvider>
            </Container>
          </Col>
        </Row>
        <Alert />
      </Container>
    </div>
  );
};

export default Layout;
