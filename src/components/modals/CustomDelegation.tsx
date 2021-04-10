import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "../UI/Button";
import Input from "../UI/input/Input";

interface IProps {
  closeModal: () => void;
  confirmCustomDelegate: (customDelegate: string) => void;
}

const ConfirmDelegation = ({ closeModal, confirmCustomDelegate }: IProps) => {
  const [customDelegate, setCustomDelegate] = useState<string>("");
  return (
    <div className="mx-auto">
      <h2>Custom delegation</h2>
      <div className="v-spacer" />
      <h6 className="full-width">Insert Public key</h6>
      <div className="v-spacer" />
      <Input
        inputHandler={e => {
          setCustomDelegate(e.currentTarget.value);
        }}
        placeholder="Insert public key"
      />
      <div className="v-spacer" />
      <Row>
        <Col xs={6}>
          <Button onClick={closeModal} className="link-button" text="Cancel" />
        </Col>
        <Col xs={6}>
          <Button
            onClick={() => confirmCustomDelegate(customDelegate)}
            className="lightGreenButton__fullMono mx-auto"
            text="Confirm"
            disabled={!customDelegate}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ConfirmDelegation;
