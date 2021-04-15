import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "../UI/Button";

interface IProps {
  publicKey: string;
  setSession: () => void;
}

const LedgerConfirmAddress = ({ publicKey, setSession }: IProps) => {
  return publicKey ? (
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
  ) : (
    <></>
  );
};

export default LedgerConfirmAddress;
