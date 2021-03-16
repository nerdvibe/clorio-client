import React from "react";
import { Row, Col } from "react-bootstrap";
import Button from "../General/Button";
import HelpHint from "../General/HelpHint";

export default function VerifyForm(props) {
  return (
    <div className="mx-auto">
      <div className="block-container fit-content-container  ">
        <div className="transaction-form animate__animated animate__fadeIn ">
          <div className="mx-auto fit-content">
            <strong>
              <h2>Verify message <HelpHint hint={"Paste the signature message in the fields in order to verify the cryptographic authenticity."}/></h2>
            </strong>
          </div>
          <div className="v-spacer" />
          <Row>
            <Col md={8} className="offset-md-2">
              <h3>Message</h3>
              <div
                className="wrap-input1 validate-input"
                data-validate="Name is required"
              >
                <span className="icon" />
                <input
                  className="input1"
                  type="text"
                  name="message"
                  value={props.message}
                  placeholder="Message "
                  onChange={(e) => props.setMessage(e.currentTarget.value)}
                />
                <span className="shadow-input1"></span>
              </div>
              <div className="v-spacer" />
              <h3>Public key</h3>
              <div
                className="wrap-input1 validate-input"
                data-validate="Name is required"
              >
                <span className="icon" />
                <input
                  className="input1"
                  type="text"
                  name="message"
                  value={props.address}
                  placeholder="Public key "
                  onChange={(e) => props.setAddress(e.currentTarget.value)}
                />
                <span className="shadow-input1"></span>
              </div>
              <div className="v-spacer" />
              <h3>Field</h3>
              <div
                className="wrap-input1 validate-input"
                data-validate="Name is required"
              >
                <span className="icon" />
                <input
                  className="input1"
                  type="text"
                  name="message"
                  value={props.field}
                  placeholder="Field "
                  onChange={(e) => props.setField(e.currentTarget.value)}
                />
                <span className="shadow-input1"></span>
              </div>
              <div className="v-spacer" />
              <h3>Scalar</h3>
              <div
                className="wrap-input1 validate-input"
                data-validate="Name is required"
              >
                <span className="icon" />
                <input
                  className="input1"
                  type="text"
                  name="message"
                  value={props.scalar}
                  placeholder="Scalar "
                  onChange={(e) => props.setScalar(e.currentTarget.value)}
                />
                <span className="shadow-input1"></span>
              </div>
              <div className="v-spacer" />
              <Button
                className="lightGreenButton__fullMono mx-auto"
                onClick={props.verifyMessage}
                disabled={props.disableButton()}
                text="Verify"
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
