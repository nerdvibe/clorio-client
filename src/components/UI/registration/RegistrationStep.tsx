import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "../Button";
import Logo from "../logo/Logo";
import { IKeypair } from "../../../types/Keypair";
import { PdfEncryption } from "./PdfEncryption";

interface IProps {
  keys: IKeypair;
  generateNew?: () => void;
  setValidation: (showValidation: boolean) => void;
}

const RegisterStep = ({ keys, generateNew, setValidation }: IProps) => {
  const [showEncryptionModal, setShowEncryptionModal] = useState<boolean>(
    false
  );
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
            <h4 className="full-width-align-center">This is your passphrase</h4>
            <div className="custom-card">
              <h5 className="full-width-align-center selectable-text break-text">
                {keys.mnemonic
                  ?.split(" ")
                  .map((word: string, index: number) => (
                    <span className="selectable-text" key={index}>
                      {word}&nbsp;
                    </span>
                  ))}
              </h5>
            </div>
            <h4 className="full-width-align-center">This is your address</h4>
            <div
              className="wrap-input1 validate-input"
              data-validate="Name is required"
            >
              <h5 className="full-width-align-center selectable-text break-text">
                {keys.publicKey}
              </h5>
            </div>
            <div className="v-spacer" />
            <h4 className="full-width-align-center">
              This is your private key
            </h4>
            <div className="wrap-input1 validate-input">
              <h5 className="full-width-align-center selectable-text break-text">
                {keys.privateKey}
              </h5>
            </div>
          </div>
          <div className="v-spacer hide-small" />
          <div
            className="wrap-input1 validate-input no-print"
            data-validate="Name is required"
          >
            <p className="full-width-align-center">
              This is the only time you will see the private key. <br />
              Make sure to write down your private key on a secure medium and
              you safe keep the private key. If you loose your private key you
              will not be able to access your funds anymore!
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
