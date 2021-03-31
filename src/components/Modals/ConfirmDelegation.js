import React from "react";
import { Row, Col } from "react-bootstrap";
import Button from "../general/Button";

export default function ConfirmDelegation(props) {
  const { name, closeModal, confirmDelegate } = props;
  return (
    <div className="mx-auto">
      <h2>Confirm Delegation</h2>
      <div className="v-spacer" />
      <h5 className="align-center mx-auto">
        Are you sure you want to <br />
        delegate this stake to <strong>{name}</strong>
      </h5>
      <div className="v-spacer" />
      <Row>
        <Col xs={6}>
          <Button onClick={closeModal} className="link-button" text="Cancel" />
        </Col>
        <Col xs={6}>
          <Button
            onClick={confirmDelegate}
            className="lightGreenButton__fullMono mx-auto"
            text="Confirm"
          />
        </Col>
      </Row>
    </div>
  );
}
