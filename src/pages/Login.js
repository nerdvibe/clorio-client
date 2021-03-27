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
import { useQuery } from "@apollo/client";
import { derivePublicKey } from "@o1labs/client-sdk";
import { GET_ID } from "../graphql/query";
import { toast } from "react-toastify";

export default function Login(props) {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivatekey] = useState("");
  const [loader, setLoader] = useState(false);
  const history = useHistory();
  const userID = useQuery(GET_ID, {
    variables: { publicKey },
    skip: publicKey === "",
  });

  // Clean component state on component dismount
  useEffect(() => {
    return () => {
      setPrivatekey("");
      setPublicKey("");
    };
  }, []);

  /**
   * If Public key has been derived, show loader and set session data
   */
  useEffect(() => {
    if (publicKey && publicKey !== "" && !userID.loading) {
      const id =
        userID.data?.public_keys?.length > 0
          ? userID.data.public_keys[0].id
          : -1;
      props.setLoader();
      storeSession(publicKey, id, false, 0).then((success) => {
        if (success) {
          history.push("/overview");
        }
      });
    }
  }, [userID]);

  /**
   * Set text from input inside component state
   * @param {event} e Input text
   */
  function inputHandler(e) {
    setPrivatekey(e.currentTarget.value);
  }

  /**
   * Uses CodaSDK to check if private key from input is valid
   */
  function checkCredentials() {
    try {
      const derivedPublicKey = derivePublicKey(privateKey);
      setPublicKey(derivedPublicKey);
      userID.refetch({ publicKey: derivedPublicKey });
      setLoader(true);
    } catch (e) {
      toast.error("Private key not valid, please try again.");
    }
  }

  /**
   * If private key is not set or empty, disable button
   * @returns boolean
   */
  function disableButton() {
    return !privateKey || privateKey === "";
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
                  Sign in with your Private Key
                </h4>
                <h6 className="full-width-align-center">
                  Don&apos;t have an wallet?{" "}
                  <Link to="/register">
                    <Button
                      className="link-button inline-element"
                      onClick={props.register}
                      text="Create one"
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
                      text="Access the wallet"
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
