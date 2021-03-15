import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Button from "../General/Button";
import Hoc from "../General/Hoc";
import Logo from "../General/Logo";
import Footer from "../General/Footer";
import { useQuery, gql } from "@apollo/client";
import { storeSession } from "../../tools";
import LedgerLoader from "../General/LedgerLoader";
import {getPublicKey} from "../../tools/ledger";

const GET_ID = gql`
  query GetIDFromPublicKey($publicKey: String) {
    public_keys(where: { value: { _eq: $publicKey } }) {
      id
    }
  }
`;

export default function LedgerGetAddress(props) {
  const [publicKey, setPublicKey] = useState(undefined);
  const [ledgerAccount] = useState(props.accountNumber || 0);
  const history = useHistory();
  const userID = useQuery(GET_ID, {
    variables: { publicKey: publicKey },
    skip: !publicKey,
  });

  useEffect(() => {
    const deviceListener = getWallet(setPublicKey);

    return deviceListener.unsubscribe;
  }, []);

  /**
   * Listen for ledger action
   * @param {function} callback Function to call after ledger confirmation
   */
  async function getWallet(callback) {
      try {
        const ledgerPublicKey = await getPublicKey(ledgerAccount)

        callback(ledgerPublicKey.publicKey);
      } catch (e) {
        console.log(e);
        props.showGlobalAlert(
          e.message || "An error occurred while loading hardware wallet",
          "error-toast"
        );
        history.push("/");
      }
  }

  /**
   * Render Ledger confirmation screen
   * @returns HTMLElement
   */
  function renderAddressConfirm() {
    if (publicKey) {
      return (
        <div>
          <h5 className="full-width-align-center">This is your public key</h5>
          <h5 className="full-width-align-center">
            Please confirm your address on ledger{" "}
          </h5>
          <div className="v-spacer" />
          <h6 className="full-width-align-center">{publicKey}</h6>
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

  /**
   * Set public key that arrived from Ledger inside the storage
   */
  function setSession() {
    if (userID.data) {
      if (userID.data.public_keys.length > 0) {
        props.setLoader();
        const id = userID.data.public_keys[0].id;
        storeSession(publicKey, id, true, ledgerAccount, () => {
          history.push("/overview");
        });
      } else {
        props.setLoader();
        storeSession(publicKey, -1, true, ledgerAccount, () => {
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
              {!publicKey ? (
                <div>
                  <h4 className="full-width-align-center">
                    Connect now your hardware wallet
                  </h4>
                  <div className="v-spacer" />
                  <LedgerLoader />
                  <div className="v-spacer" />
                  <h6 className="full-width-align-center">
                    Looking for publicKey
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
