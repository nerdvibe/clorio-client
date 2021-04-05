import { Col, Row } from "react-bootstrap";
import { ISignature } from "../../../models/Signature";
import Button from "../../UI/Button";

interface IProps {
  signature: ISignature;
  publicKey: string;
  payload: string;
  reset: () => void;
}

const SignMessageResult = ({
  publicKey,
  payload,
  signature,
  reset,
}: IProps) => {
  const { field, scalar } = signature;
  return (
    <div className="mx-auto">
      <div className="block-container fit-content-container">
        <div className="transaction-form animate__animated animate__fadeIn ">
          <div className="mx-auto fit-content">
            <strong>
              <h2>Your signed message</h2>
            </strong>
          </div>
          <div className="v-spacer" />
          <Row>
            <Col md={8} className="offset-md-2">
              <div className="signed-message-container my-auto">
                <p>----- MESSAGE -----</p>
                <p>{payload}</p>
                <p>----- PUBLIC KEY -----</p>
                <p>{publicKey}</p>
                <p>----- FIELD -----</p>
                <p>{field}</p>
                <p>----- SCALAR -----</p>
                <p>{scalar}</p>
              </div>
              <div className="v-spacer" />
              <Button
                className="link-button inline-element"
                onClick={reset}
                text="Sign new message"
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default SignMessageResult;
