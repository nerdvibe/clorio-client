import { Col, Row } from "react-bootstrap";
import { ISignature } from "../../../types/Signature";
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
              <div className="signed-message-container my-auto selectable-text">
                <p className="selectable-text">----- MESSAGE -----</p>
                <p className="selectable-text">{payload}</p>
                <p className="selectable-text">----- PUBLIC KEY -----</p>
                <p className="selectable-text">{publicKey}</p>
                <p className="selectable-text">----- FIELD -----</p>
                <p className="selectable-text">{field}</p>
                <p className="selectable-text">----- SCALAR -----</p>
                <p className="selectable-text">{scalar}</p>
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
