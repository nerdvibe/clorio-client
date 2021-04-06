import { Col, Row } from "react-bootstrap";
import { Copy } from "react-feather";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";
import Logo from "../../components/UI/Logo";
import { IKeypair } from "../../models/Keypair";
import { copyToClipboard, downloadPaperWalletPDF } from "../../tools";

interface IProps {
  keys: IKeypair;
  generateNew: () => void;
  setValidation: (showValidation: boolean) => void;
}

const RegisterStep = ({ keys, generateNew, setValidation }: IProps) => (
  <div className="animate__animated animate__fadeIn full-width">
    <Row className="full-width">
      <Col
        md={12}
        lg={10}
        xl={8}
        className="offset-lg-1 offset-xl-2 text-center">
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
            data-validate="Name is required">
            <h5 className="full-width-align-center">
              {keys.publicKey}
              <Button
                className="inline-element no-print"
                icon={<Copy />}
                onClick={() => copyToClipboard(keys.publicKey)}
              />
            </h5>
          </div>
          <div className="v-spacer" />
          <h4 className="full-width-align-center">This is your private key</h4>
          <div className="wrap-input1 validate-input">
            <h5 className="full-width-align-center">
              {keys.privateKey}
              <Button
                className="inline-element no-print"
                icon={<Copy />}
                onClick={() => copyToClipboard(keys.privateKey)}
              />
            </h5>
          </div>
        </div>
        <div className="v-spacer" />
        <div
          className="wrap-input1 validate-input no-print"
          data-validate="Name is required">
          <p className="full-width-align-center">
            This is the only time you will see the passphrase and the private
            key. <br />
            Make sure have made a copy of them. If you loose your private key
            you will not be able to access your funds anymore! <br />
            <a
              className="link-button"
              onClick={() => downloadPaperWalletPDF(keys)}>
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
  </div>
);

export default RegisterStep;
