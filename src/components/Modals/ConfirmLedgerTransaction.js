import React from "react";
import { Row, Col } from "react-bootstrap";
import { toLongMINA } from "../../tools/utils";

export default function ConfirmLedgerTransaction(props) {
  const { amount, fee, receiverAddress, memo } = props.transactionData;
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
              You are about to send <strong>{toLongMINA(amount)} Mina</strong>{" "}
              <br />
              with a fee of <strong>{toLongMINA(fee)} Mina</strong> <br />
              to <strong>{receiverAddress}</strong> <br />
              {memo ? (
                <>
                  with memo <strong>{memo}</strong>
                </>
              ) : null}
              <div className="v-spacer" />
              <div className="mx-auto">
                <div className="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <strong>Check your hardware wallet to proceed</strong>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
