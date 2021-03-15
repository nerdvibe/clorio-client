import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Button from "../components/General/Button";
import Hoc from "../components/General/Hoc";
import { Copy } from "react-feather";
import Logo from "../components/General/Logo";
import Footer from "../components/General/Footer";
import * as CodaSDK from "@o1labs/client-sdk";
import { storeSession } from "../tools";
import { copyToClipboard } from "../tools/utils";
import Input from "../components/General/Input";
import html2pdf from "html2pdf.js";
import Spinner from "../components/General/Spinner";

export default function Register(props) {
  const [validation, setValidation] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [keys, setKeys] = useState(undefined);
  const [validationText, setValidationText] = useState("");
  const history = useHistory();
  const privateKey = keys ? keys.privateKey : "";
  const publicKey = keys ? keys.publicKey : "";

  useEffect(() => {
    if (!keys) {
      const userKeys = CodaSDK.genKeys();
      setKeys(userKeys);
    }
  }, []);

  /**
   * Set input text inside component state
   * @param {string} text Input text
   */
  function inputHandler(text) {
    setValidationText(text);
  }

  /**
   * If input text is equal to given private key in the previous state, unlock the Button
   * @returns boolean
   */
  function checkButtonState() {
    if (validationText === keys.privateKey) {
      return false;
    }
    return true;
  }

  /**
   * Save public key, wallet id inside the storage
   */
  function setAuthorization() {
    props.setLoader();
    storeSession(publicKey, -1, false, 0 ,() => {
      history.push("/overview");
    });
  }

  /**
   * Generate new key pair
   */
  function generateNew() {
    const userKeys = CodaSDK.genKeys();
    setKeys(userKeys);
  }

  /**
   * Go back to data screen
   */
  function stepBackwards() {
    setValidationText(undefined);
    setValidation(false);
  }

  /**
   * Download PDF with sensible data
   */
  function downloadPDF() {
    setShowLoader(true);
    const elementsToHide = document.getElementsByClassName("no-print");
    const elementInitalState = [];
    for (const el of elementsToHide) {
      elementInitalState.push(el.style.display);
      el.style.display = "none";
    }
    const elementsToShow = document.getElementsByClassName("pdf-only");
    for (const el of elementsToShow) {
      el.style.display = "inline";
    }
    const element = document.getElementById("element-to-print");
    html2pdf()
      .set({
        margin: 25,
        filename: "MinaHub-Paperwallet.pdf",
      })
      .from(element)
      .save();
    setTimeout(() => {
      for (const el of elementsToHide) {
        const tmpStyle = elementInitalState.pop();
        el.style.display = tmpStyle;
      }
      for (const el of elementsToShow) {
        el.style.display = "none";
      }
      setShowLoader(false);
    }, 250);
  }

  /**
   * Render wallet data screen
   * @returns HTMLElement
   */
  function renderRegisterStep() {
    return (
      <Spinner show={showLoader}>
        <Row className="full-width">
          <Col md={10} xl={8} className="offset-md-1 offset-xl-2 text-center">
            <div id="element-to-print">
              <div className="v-spacer-big pdf-only" />
              <div className="v-spacer-big pdf-only" />
              <div className="mx-auto fit-content">
                <Logo big={true} />
              </div>
              <div className="v-spacer no-print" />
              <h4 className="full-width-align-center">This is your address</h4>
              <div
                className="wrap-input1 validate-input"
                data-validate="Name is required"
              >
                <h5 className="full-width-align-center">
                  {publicKey}
                  <Button
                    className="inline-element no-print"
                    icon={<Copy />}
                    onClick={() => copyToClipboard(publicKey)}
                  />
                </h5>
              </div>
              <div className="v-spacer" />
              <h4 className="full-width-align-center">
                This is your private key
              </h4>
              <div className="wrap-input1 validate-input">
                <h5 className="full-width-align-center">
                  {privateKey}
                  <Button
                    className="inline-element no-print"
                    icon={<Copy />}
                    onClick={() => copyToClipboard(privateKey)}
                  />
                </h5>
              </div>
            </div>
            <div className="v-spacer" />
            <div
              className="wrap-input1 validate-input no-print"
              data-validate="Name is required"
            >
              <p className="full-width-align-center">
                This is the only time you will see the passphrase and the
                private key. <br />
                Make sure have made a copy of them. If you loose your private
                key you will not be able to access your funds anymore! <br />
                <a className="link-button" onClick={downloadPDF}>
                  Download a copy here
                </a>
              </p>
            </div>
            <div className="v-spacer" />
            <Row className="no-print">
              <Col xs={4}>
                <Link to="/">
                  <Button className="link-button mx-auto" text="Cancel" />
                </Link>
              </Col>
              <Col xs={4}>
                <Button
                  className="link-button mx-auto"
                  text="Generate new key"
                  onClick={generateNew}
                />
              </Col>
              <Col xs={4}>
                <Button
                  className="lightGreenButton__fullMono mx-auto"
                  onClick={() => setValidation(true)}
                  text="Continue"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Spinner>
    );
  }

  /**
   * Render private key validation screen
   * @returns HTMLElement
   */
  function renderValidationStep() {
    return (
      <div className="full-width">
        <div className="mx-auto medium-size-box">
          <div className="mx-auto fit-content">
            <Logo big={true} />
          </div>
          <div className="v-spacer no-print" />
          <div className="v-spacer" />
          <h4 className="full-width-align-center">Verify your Private key</h4>
          <div className="v-spacer" />
          <div className="wrap-input1 validate-input">
            <h5 className="full-width-align-center">
              <Input
                inputHandler={(e) => inputHandler(e.currentTarget.value)}
                placeholer="Private key"
              />
            </h5>
          </div>
          <div className="v-spacer" />
          <Row className="no-print">
            <Col xs={6}>
              <Button
                className="link-button mx-auto"
                text="Cancel"
                onClick={stepBackwards}
              />
            </Col>
            <Col xs={6}>
              <Button
                className="lightGreenButton__fullMono mx-auto"
                onClick={setAuthorization}
                text="Continue"
                disabled={checkButtonState()}
                link="/overview"
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  return (
    <Hoc className="main-container ">
      <div className="block-container no-bg real-full-page-container center">
        {validation ? renderValidationStep() : renderRegisterStep()}
        <Footer network={props.network} />
      </div>
    </Hoc>
  );
}
