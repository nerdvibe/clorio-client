import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "../../UI/Button";
import HelpHint from "../../UI/HelpHint";
import Input from "../../UI/input/Input";

interface IProps {
  submitHandler: (data: any) => void;
}

const SignMessageForm = ({ submitHandler }: IProps) => {
  const [message, setMessage] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");

  /**
   * Clean component state on component dismount
   */
  useEffect(() => {
    return () => {
      setMessage("");
      setPrivateKey("");
    };
  }, []);

  /**
   * Check if message and private key are not empty
   * @returns boolean
   */
  const signButtonStateHandler = () => {
    const checkCondition = !message || !privateKey;
    return checkCondition;
  };

  /**
   * Create the object to be signed and sign it
   */
  const createObjectAndSign = () => {
    const messageToSign = {
      message,
      privateKey,
    };
    submitHandler(messageToSign);
  };

  return (
    <div className="mx-auto">
      <div className="block-container fit-content-container  ">
        <div className="transaction-form animate__animated animate__fadeIn ">
          <div className="mx-auto fit-content">
            <strong>
              <h2>
                Sign message{" "}
                <HelpHint
                  hint={"Cryptographically sign a message with your keypair."}
                />
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
              <h3>Private key</h3>
              <div
                className="wrap-input1 validate-input"
                data-validate="Name is required">
                <span className="icon" />
                <Input
                  type="text"
                  name="privateKey"
                  value={privateKey}
                  placeholder="Private key"
                  inputHandler={e => setPrivateKey(e.currentTarget.value)}
                />
              </div>
              <div className="v-spacer" />
              <Button
                className="lightGreenButton__fullMono mx-auto"
                onClick={createObjectAndSign}
                disabled={signButtonStateHandler()}
                text="Sign"
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default SignMessageForm;
