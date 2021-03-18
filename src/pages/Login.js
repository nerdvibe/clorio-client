/* eslint react/prop-types: 0 */
import React from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Button from "../components/General/Button";
import Hoc from "../components/General/Hoc";
import Logo from "../components/General/Logo";
import Footer from "../components/General/Footer";
import { useState, useEffect } from "react";
import { storeSession } from "../tools";
import Input from "../components/General/Input";
import * as CodaSDK from "@o1labs/client-sdk";
import { useQuery, gql } from "@apollo/client";

const GET_ID = gql`
  query GetIDFromPublicKey($publicKey: String) {
    public_keys(where: { value: { _eq: $publicKey } }) {
      id
    }
  }
`;

export default function Login(props) {
  const [passphrase, setpassphrase] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [loader, setLoader] = useState(false);
  const history = useHistory();

  const userID = useQuery(GET_ID, {
    variables: { publicKey },
    skip: publicKey === "",
  });

  useEffect(() => {
    if (publicKey && publicKey !== "") {
      userID.refetch({ publicKey });
      if (userID.data) {
        if (userID.data.public_keys.length > 0) {
          props.setLoader();
          const id = userID.data.public_keys[0].id;
          storeSession(publicKey, id, false, 0 ,() => {
            history.push("/overview");
          });
        } else {
          props.setLoader();
          storeSession(publicKey, -1, false, 0 ,() => {
            history.push("/overview");
          });
        }
      }
    }
  }, [userID]);

  /**
   * Set text from input inside component state
   * @param {event} e Input text
   */
  function inputHandler(e) {
    setpassphrase(e.currentTarget.value);
  }

  /**
   * Uses CodaSDK to check if private key from input is valid
   */
  function checkCredentials() {
    try {
      const derivedPublicKey = CodaSDK.derivePublicKey(passphrase);
      setPublicKey(derivedPublicKey);
      setLoader(true);
    } catch (e) {
      props.showGlobalAlert(
        "Private key not valid, please try again.",
        "error-toast"
      );
    }
  }

  /**
   * If private key is not set or empty, disable button
   * @returns boolean
   */
  function disableButton() {
    if (!passphrase) {
      return true;
    }
    if (passphrase === "") {
      return true;
    }
    return false;
  }

  return (
    <Hoc>
      <Spinner show={loader}>
        <div className="block-container no-bg real-full-page-container center no-margin animate__animated animate__fadeIn">
          <div className="full-width">
            <Row>
              <Col
                md={12}
                lg={10}
                xl={6}
                className="offset-lg-1 offset-xl-3 text-center"
              >
                <div className="mx-auto fit-content">
                  <Logo big="true" />
                </div>
                <div className="v-spacer" />
                <h4 className="full-width-align-center">
                  Sign in with your passphrase
                </h4>
                <h6 className="full-width-align-center">
                  Don&apos;t have an account?{" "}
                  <Link to="/register">
                    <Button
                      className="link-button inline-element"
                      onClick={props.register}
                      text="Sign-in"
                    />
                  </Link>
                </h6>
                <div className="v-spacer" />
                <div className="v-spacer" />
                <Input inputHandler={inputHandler} placeholder="Enter here" />
                <div className="v-spacer" />
                <Row>
                  <Col xs={6}>
                    <Link to="/">
                      <Button
                        className="link-button mx-auto"
                        onClick={props.register}
                        text="Cancel"
                      />
                    </Link>
                  </Col>
                  <Col xs={6}>
                    <Button
                      className="lightGreenButton__fullMono mx-auto"
                      onClick={checkCredentials}
                      text="Access a wallet"
                      disabled={disableButton()}
                    />
                  </Col>
                </Row>
                <div className="v-spacer" />
                <div className="v-spacer" />
              </Col>
            </Row>
          </div>
        </div>
        <Footer network={props.network} />
      </Spinner>
    </Hoc>
  );
}
