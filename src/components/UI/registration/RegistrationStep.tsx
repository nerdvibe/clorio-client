import { useState } from "react";
import { Accordion, Col, Row } from "react-bootstrap";
import { IKeypair } from "../../../types/Keypair";
import { PdfEncryption } from "./PdfEncryption";
import Button from "../../UI/Button";
import isElectron from "is-electron";
import { isChrome } from "../../../tools";
import { INetworkData } from "../../../types";
import { ArrowLeft, ArrowRight } from "react-feather";

interface IProps {
  keys: IKeypair;
  setValidation: (showValidation: boolean) => void;
  network?: INetworkData;
  goToNext: () => void;
  goBack: () => void;
}

const RegisterStep = ({ keys, setValidation, goToNext, goBack }: IProps) => {
  const [showEncryptionModal, setShowEncryptionModal] = useState<boolean>(
    false
  );
  const [showDetails, setShowDetails] = useState(false);
  const spaceChar = isElectron() || isChrome ? <>&nbsp;</> : " ";
  return (
    <div className="animate__animated animate__fadeIn glass-card registration-card">
      <div className="">
        <div id="element-to-print">
          <div className="v-spacer-big pdf-only" />
          <div className="v-spacer-big pdf-only" />
          <div className="w-100">
            <div className="flex flex-col flex-vertical-center">
              <h1>Create new</h1>
              <p className="text-center mt-1">Take a note of your wallet</p>
              <div className="divider" />
            </div>
          </div>
          <div className="v-spacer no-print" />
          <Accordion>
            <div className="align-left label">
              <Row className="lh-10">
                <Col xs={8}>
                  <strong>Passphrase</strong>
                </Col>
                <Col xs={4}>
                  <span className="half-width-align-center">
                    <Accordion.Toggle
                      onClick={() => setShowDetails(!showDetails)}
                      eventKey="0"
                      className={`no-style-button right-side-animation`}
                    >
                      <Button
                        className="link-button"
                        text={`${!showDetails ? "Show" : "Close"} details`}
                      />
                    </Accordion.Toggle>
                  </span>
                </Col>
              </Row>
              <small>
                Please carefully write down these 12 words and store them in a
                safe place.
              </small>
            </div>
            <div className="passphrase-box">
              {keys.mnemonic?.split(" ").map((word, index) => (
                <div
                  key={index}
                  className="inline-block-element word-box align-left"
                >
                  <span className="word-index">{index + 1}.</span>
                  <span className="selectable-text ">
                    {word}
                    {index === 11 ? "" : spaceChar}
                  </span>
                </div>
              ))}
            </div>
            <Accordion.Collapse eventKey="0">
              <div>
                <div className="align-left mt-3 mb-2 label">
                  <strong>Public key</strong>
                  <br />
                  <small>This is your address</small>
                </div>
                <div
                  className="wrap-input1 validate-input passphrase-box mb-0"
                  data-validate="Name is required"
                >
                  <h5 className="w-100 pl-3 selectable-text mb-0">
                    {keys.publicKey}
                  </h5>
                </div>
                <div className="align-left mt-3 mb-2 label">
                  <strong>Private key</strong>
                  <br />
                  <small>This is your private key</small>
                </div>
                <div className="wrap-input1 validate-input passphrase-box">
                  <h5 className="w-100 pl-3 selectable-text mb-0">
                    {keys.privateKey}
                  </h5>
                </div>
              </div>
            </Accordion.Collapse>
          </Accordion>
        </div>
        <div className="v-spacer hide-small" />
        <div className="w-100 align-left">
          This is the only time you will see the private key. <br />
          Make sure to write down your private key on a secure medium and you
          safe keep the private key. <br />
          If you loose your private key you will not be able to access your
          funds anymore!
        </div>
        <div className="mt-3">
          <a
            className="link-button"
            onClick={() => setShowEncryptionModal(true)}
          >
            Download a copy here
          </a>
        </div>
        <div className="v-spacer hide-small" />
        <div className="half-width-align-center">
          <Row className="no-print">
            <Col xs={6}>
              <Button
                className="big-icon-button"
                icon={<ArrowLeft />}
                text="Go back"
                onClick={goBack}
              />
            </Col>
            <Col xs={6}>
              <Button
                onClick={() => {
                  goToNext();
                  setValidation(true);
                }}
                text="Continue"
                style="primary"
                icon={<ArrowRight />}
                appendIcon
              />
            </Col>
          </Row>
        </div>
      </div>
      {showEncryptionModal && (
        <PdfEncryption
          keypair={keys}
          closeModal={() => setShowEncryptionModal(false)}
        />
      )}
    </div>
  );
};

export default RegisterStep;
