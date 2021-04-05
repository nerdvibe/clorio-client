import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "../../UI/Button";
import HelpHint from "../../UI/HelpHint";
import Input from "../../UI/input/Input";
import { IMessageToVerify } from "../../../models/MessageToVerify";

interface IProps {
  verifyMessage: (messageToVerify: IMessageToVerify) => void;
}

const VerifyForm = ({ verifyMessage }: IProps) => {
  const [message, setMessage] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [field, setField] = useState<string>("");
  const [scalar, setScalar] = useState<string>("");

  /**
   * If one between address,message,field or scalar is empty button is disabled
   * @returns boolean
   */
  const disableButton = () => {
    return address === "" || message === "" || field === "" || scalar === "";
  };

  /**
   * Create the object containing the message to be verified and verify it
   */
  const createDataObjectAndVerify = () => {
    const messageToVerify = {
      message,
      address,
      field,
      scalar,
    };
    verifyMessage(messageToVerify);
  };

  return (
    <div className="mx-auto">
      <div className="block-container fit-content-container  ">
        <div className="transaction-form animate__animated animate__fadeIn ">
          <div className="mx-auto fit-content">
            <strong>
              <h2>
                Verify message{" "}
                <HelpHint hint="Paste the signature message in the fields in order to verify the cryptographic authenticity." />
              </h2>
            </strong>
          </div>
          <div className="v-spacer" />
          <Row>
            <Col md={8} className="offset-md-2">
              <h3>Message</h3>
              <div
                className="wrap-input1 validate-input"
                data-validate="Name is required">
                <span className="icon" />
                <Input
                  className="input1"
                  type="text"
                  name="message"
                  value={message}
                  placeholder="Message "
                  inputHandler={e => setMessage(e.currentTarget.value)}
                />
              </div>
              <div className="v-spacer" />
              <h3>Public key</h3>
              <div
                className="wrap-input1 validate-input"
                data-validate="Name is required">
                <span className="icon" />
                <Input
                  className="input1"
                  type="text"
                  name="message"
                  value={address}
                  placeholder="Public key "
                  inputHandler={e => setAddress(e.currentTarget.value)}
                />
              </div>
              <div className="v-spacer" />
              <h3>Field</h3>
              <div
                className="wrap-input1 validate-input"
                data-validate="Name is required">
                <span className="icon" />
                <Input
                  className="input1"
                  type="text"
                  name="message"
                  value={field}
                  placeholder="Field "
                  inputHandler={e => setField(e.currentTarget.value)}
                />
              </div>
              <div className="v-spacer" />
              <h3>Scalar</h3>
              <div
                className="wrap-input1 validate-input"
                data-validate="Name is required">
                <span className="icon" />
                <Input
                  className="input1"
                  type="text"
                  name="message"
                  value={scalar}
                  placeholder="Scalar "
                  inputHandler={e => setScalar(e.currentTarget.value)}
                />
              </div>
              <div className="v-spacer" />
              <Button
                className="lightGreenButton__fullMono mx-auto"
                onClick={createDataObjectAndVerify}
                disabled={disableButton()}
                text="Verify"
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default VerifyForm;
