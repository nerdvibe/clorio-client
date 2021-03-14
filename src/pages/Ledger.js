import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Button from "../components/General/Button";
import Hoc from "../components/General/Hoc";
import Logo from "../components/General/Logo";
import Footer from "../components/General/Footer";
import ledger from "../tools/ledger";
import { useQuery, gql } from "@apollo/client";
import { storeSession } from "../tools";
import LedgerLoader from "../components/General/LedgerLoader";

const GET_ID = gql`
  query GetIDFromPublicKey($publicKey: String) {
    public_keys(where: { value: { _eq: $publicKey } }) {
      id
    }
  }
`;

export default function Ledger(props) {
  const [devices, setDevices] = useState(undefined);
  const history = useHistory();
  const userID = useQuery(GET_ID, {
    variables: { publicKey: devices },
    skip: !devices,
  });

  useEffect(() => {
    const deviceListener = getWallet(setDevices);

    return deviceListener.unsubscribe;
  }, []);

  async function getWallet(callback) {
    const updateDevices = async () => {
      try {
        const response = await ledger.getAddress(1);
        callback(response);
      } catch (e) {
        props.showGlobalAlert(
          "An error occurred while loading hardware wallet"
        );
        history.push("/");
      }
    };
    try {
      updateDevices();
    } catch (e) {
      props.showGlobalAlert("An error occurred while loading hardware wallet");
      history.push("/");
    }
  }

  function renderAddressConfirm() {
    if (devices) {
      return (
        <div>
          <h5 className="full-width-align-center">This is your public key</h5>
          <h5 className="full-width-align-center">
            Please confirm your address on ledger{" "}
          </h5>
          <div className="v-spacer" />
          <h6 className="full-width-align-center">{devices}</h6>
          <div className="v-spacer" />
          <div className="v-spacer" />
          <Row>
            <Col md={6}>
              <Link to="/">
                <Button className="link-button mx-auto" text="Go back" />
              </Link>
            </Col>
            <Col md={6}>
              <Button
                className="lightGreenButton__fullMono mx-auto"
                onClick={setSession}
                text="Access wallet"
              />
            </Col>
          </Row>
        </div>
      );
    }
  }

  function setSession() {
    if (userID.data) {
      if (userID.data.public_keys.length > 0) {
        props.setLoader();
        const id = userID.data.public_keys[0].id;
        storeSession(devices, id, true, () => {
          history.push("/overview");
        });
      } else {
        props.setLoader();
        storeSession(devices, -1, true, () => {
          history.push("/overview");
        });
      }
    }
  }

  return (
    <Hoc>
      <div className="block-container real-full-page-container center">
        <div className="full-width">
          <Row>
            <Col md={8} xl={8} className="offset-md-2 offset-xl-2 text-center">
              <div className="mx-auto fit-content">
                <Logo big="true" />
              </div>
              <div className="v-spacer" />
              <div className="v-spacer" />
              <div className="v-spacer" />
              {!devices ? (
                <div>
                  <h4 className="full-width-align-center">
                    Connect now your hardware wallet
                  </h4>
                  <div className="v-spacer" />
                  <LedgerLoader />
                  <div className="v-spacer" />
                  <h6 className="full-width-align-center">
                    Looking for devices
                  </h6>
                  <div className="v-spacer" />
                  <Link to="/">
                    <Button className="link-button mx-auto" text="Go back" />
                  </Link>
                </div>
              ) : (
                renderAddressConfirm()
              )}
            </Col>
          </Row>
        </div>
      </div>
      <Footer network={props.network} />
    </Hoc>
  );
}
