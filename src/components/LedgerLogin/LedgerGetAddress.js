import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Button from "../general/Button";
import Hoc from "../general/Hoc";
import Logo from "../general/Logo";
import Footer from "../general/Footer";
import { useQuery } from "@apollo/client";
import { storeSession } from "../../tools";
import LedgerLoader from "../general/LedgerLoader";
import { GET_ID } from "../../graphql/query";
import { getPublicKey } from "../../tools/ledger";
import { toast } from "react-toastify";

export default function LedgerGetAddress(props) {
  const [publicKey, setPublicKey] = useState(undefined);
  const [ledgerAccount] = useState(props.accountNumber || 0);
  const history = useHistory();
  const userID = useQuery(GET_ID, {
    variables: { publicKey: publicKey },
    skip: !publicKey,
  });

  useEffect(() => {
    const deviceListener = getWallet();
    return deviceListener.unsubscribe;
  }, []);

  /**
   * Set public key that arrived from Ledger inside the storage
   */
  function setSession() {
    if (userID.data) {
      props.setLoader();
      const id =
        userID.data?.public_keys?.length > 0
          ? userID.data.public_keys[0].id
          : -1;
      storeSession(publicKey, id, true, ledgerAccount).then((success) => {
        if (success) {
          history.push("/overview");
        }
      });
    }
  }

  /**
   * Listen for ledger action
   */
  const getWallet = async () => {
    try {
      const ledgerPublicKey = await getPublicKey(ledgerAccount);
      setPublicKey(ledgerPublicKey.publicKey);
    } catch (e) {
      console.log(e);
      toast.error(
        e.message || "An error occurred while loading hardware wallet"
      );
      history.push("/");
    }
  };

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
                    Let&apos;s verify the your address
                  </h4>
                  <div className="v-spacer" />
                  <LedgerLoader />
                  <div className="v-spacer" />
                  <h6 className="full-width-align-center">
                    Looking for the publicKey. Please confirm it on your Ledger
                    device
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
