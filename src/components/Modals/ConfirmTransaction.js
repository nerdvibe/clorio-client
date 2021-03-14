import React from "react";
import { Row, Col } from "react-bootstrap";
import { toMINA } from "../../tools/utils";
import Button from "../General/Button";

export default function ConfirmTransaction(props) {
  const {amount,fee,address,memo} = props.transactionData
  const {stepBackward,sendTransaction} = props
  return (
    <div className="mx-auto  ">
      <div className="block-container full-page-container">
        <div className="vertical-center">
          <div className="mx-auto fit-content">
            <strong>
              <h2>Create new transaction</h2>
            </strong>
          </div>
          <div className="v-spacer" />
          <Row>
            <Col md={8} className="offset-md-2">
              You are about to send{" "}
              <strong>{toMINA(props.transactionData.amount)} MINA</strong>{" "}
              <br />
              with a fee of{" "}
              <strong>{toMINA(props.transactionData.fee)} MINA</strong> <br />
              to <strong>{props.transactionData.address}</strong> <br />
              with memo <strong>{props.transactionData.memo}</strong>
              <div className="v-spacer" />
              <div className="mx-auto">
                <Row>
                  <Col md={3} className="offset-md-3">
                    <Button
                      className="link-button inline-element"
                      onClick={stepBackward}
                      text="Cancel"
                    />
                  </Col>
                  <Col md={3}>
                    <Button
                      className="lightGreenButton__fullMono inline-element mx-auto"
                      onClick={sendTransaction}
                      text="Confirm"
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
