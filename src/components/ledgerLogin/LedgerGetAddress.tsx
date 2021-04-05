import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Button from "../UI/Button";
import Hoc from "../UI/Hoc";
import Logo from "../UI/Logo";
import Footer from "../UI/Footer";
import { useQuery } from "@apollo/client";
import { storeSession } from "../../tools";
import LedgerLoader from "../UI/LedgerLoader";
import { GET_ID } from "../../graphql/query";
import { getPublicKey } from "../../tools/ledger";
import { toast } from "react-toastify";
import { IProps } from "./LedgerLoginProps";
import LedgerConfirmAddress from "./LedgerConfirmAddress";

const LedgerGetAddress = (props: IProps) => {
  const [publicKey, setPublicKey] = useState("");
  const [ledgerAccount] = useState(props.accountNumber || 0);
  const history = useHistory();
  const userID = useQuery(GET_ID, {
    variables: { publicKey: publicKey },
    skip: !publicKey,
  });

  useEffect(() => {
    const deviceListener = getWallet();
    // To be checked with ledger tests
    // @ts-ignore
    return deviceListener.unsubscribe;
  }, []);

  /**
   * Set public key that arrived from Ledger inside the storage
   */
  const setSession = () => {
    if (userID.data && !!publicKey) {
      props.toggleLoader();
      const id =
        userID.data?.public_keys?.length > 0
          ? userID.data.public_keys[0].id
          : -1;
      storeSession(publicKey, id, true, ledgerAccount).then(success => {
        if (success) {
          history.push("/overview");
        }
      });
    }
  };

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
        e.message || "An error occurred while loading hardware wallet",
      );
      history.push("/");
    }
  };

  return (
    <Hoc>
      <div className="block-container real-full-page-container center">
        <div className="full-width">
          <Row>
            <Col md={8} xl={8} className="offset-md-2 offset-xl-2 text-center">
              <div className="mx-auto fit-content">
                <Logo big={true} />
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
                <LedgerConfirmAddress
                  publicKey={publicKey}
                  setSession={setSession}
                />
              )}
            </Col>
          </Row>
        </div>
      </div>
      <Footer network={props.network} />
    </Hoc>
  );
};

export default LedgerGetAddress;
