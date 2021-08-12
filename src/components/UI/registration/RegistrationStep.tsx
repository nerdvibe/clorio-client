import { useState } from "react";
import { Accordion, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../logo/Logo";
import { IKeypair } from "../../../types/Keypair";
import { PdfEncryption } from "./PdfEncryption";
import Button from "../../UI/Button";

interface IProps {
  keys: IKeypair;
  generateNew?: () => void;
  setValidation: (showValidation: boolean) => void;
}

const RegisterStep = ({ keys, generateNew, setValidation }: IProps) => {
  const [showEncryptionModal, setShowEncryptionModal] = useState<boolean>(
    false
  );
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="animate__animated animate__fadeIn full-width">
      <Row className="full-width">
        <Col md={12} lg={12} xl={10} className="offset-xl-1 text-center">
          <div id="element-to-print">
            <div className="v-spacer-big pdf-only" />
            <div className="v-spacer-big pdf-only" />
            <div className="mx-auto fit-content">
              <Logo big={true} />
            </div>
            <div className="v-spacer no-print" />
            <div className="full-width-align-center label">
              This is your passphrase
            </div>
            <div className="custom-card mnemonic-card half-width-align-center ">
              <div className="selectable-text break-text">
                {keys.mnemonic?.split(" ").map((word, index) => (
                  <span
                    className="badge badge-info no-bg custom-badge"
                    key={index}
                    style={{ color: "#000", fontWeight: 400 }}
                  >
                    <span className="word-index">{index + 1}.</span>
                    <span className="selectable-text ">{word}&nbsp;</span>
                  </span>
                ))}
              </div>
            </div>
            <Accordion>
              <div className="half-width-align-center">
                <Accordion.Toggle
                  onClick={() => setShowDetails(!showDetails)}
                  eventKey="0"
                  className={`no-style-button ${
                    showDetails
                      ? "right-side-animation"
                      : "center-side-animation"
                  }`}
                >
                  <Button
                    className="link-button"
                    text={`${!showDetails ? "Show" : "Close"} details`}
                  />
                </Accordion.Toggle>
              </div>
              <Accordion.Collapse eventKey="0">
                <div>
                  <div className="full-width-align-center label">
                    This is your address
                  </div>
                  <div
                    className="wrap-input1 validate-input"
                    data-validate="Name is required"
                  >
                    <h5 className="full-width-align-center selectable-text break-text">
                      {keys.publicKey}
                    </h5>
                  </div>
                  <div className="v-spacer" />
                  <div className="full-width-align-center label">
                    This is your private key
                  </div>
                  <div className="wrap-input1 validate-input">
                    <h5 className="full-width-align-center selectable-text break-text">
                      {keys.privateKey}
                    </h5>
                  </div>
                </div>
              </Accordion.Collapse>
            </Accordion>
          </div>
          <div className="v-spacer hide-small" />
          <div
            className="wrap-input1 validate-input no-print"
            data-validate="Name is required"
          >
            <p className="full-width-align-center">
              This is the only time you will see the private key. <br />
              Make sure to write down your private key on a secure medium and
              you safe keep the private key. <br />
              If you loose your private key you will not be able to access your
              funds anymore!
              <br />
              <a
                className="link-button"
                onClick={() => setShowEncryptionModal(true)}
              >
                Download a copy here
              </a>
            </p>
          </div>
          <div className="v-spacer hide-small" />
          <div className="half-width-align-center">
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
          </div>
        </Col>
      </Row>
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
