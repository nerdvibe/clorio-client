import React from "react";
import { Row, Col } from "react-bootstrap";
import Button from "./Button";
import Input from "./Input";

export default function TransactionForm(props) {
  return (
    <div className="mx-auto  ">
      <div className="block-container fit-content-container">
        <div className="transaction-form">
          <div className="mx-auto fit-content">
            <strong>
              <h2>Create new transaction</h2>
            </strong>
          </div>
          <div className="v-spacer" />
          <Row>
            <Col md={8} className="offset-md-2">
              <h3>Recipient</h3>
              <Input
                value={props.transactionData.address}
                placeholder="Enter an amount "
                inputHandler={(e) => addressHandler(e.currentTarget.value)}
              />
              <h3>Memo</h3>
              <Input
                value={props.transactionData.memo}
                placeholder="Enter an amount "
                inputHandler={(e) => memoHandler(e.currentTarget.value)}
              />
              <Row>
                <Col md={12} xl={6}>
                  <h3>Amount</h3>
                  <Input
                    value={props.transactionData.amount}
                    placeholder="Enter an amount "
                    inputHandler={(e) => amountHandler(e.currentTarget.value)}
                    type="number"
                  />
                </Col>
                <Col md={12} xl={6}>
                  <Row>
                    <Col md={4} className="align-initial">
                      <h3 className="inline-element ">Fee</h3>
                    </Col>
                    <Col className="fee-label">
                      <Button
                        className="link-button align-end  no-padding"
                        text="Average"
                        onClick={setDefaultFee}
                      />
                    </Col>
                    <Col className="fee-label">
                      <Button
                        className="link-button align-end  no-padding"
                        text="Fast"
                        onClick={setFastFee}
                      />
                    </Col>
                  </Row>
                  <Input
                    value={props.transactionData.fee}
                    placeholder="Enter a fee "
                    inputHandler={(e) => feeHandler(e.currentTarget.value)}
                    type="number"
                  />
                </Col>
              </Row>
              <div className="v-spacer" />
              <Button
                className="lightGreenButton__fullMono mx-auto"
                onClick={props.nextStep}
                text="Preview"
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );

  function setDefaultFee() {
    if (props.defaultFee) {
      props.setData({
        ...props.transactionData,
        fee: props.defaultFee,
      });
    } else {
      props.setData({
        ...props.transactionData,
        fee: 0.1,
      });
    }
  }

  function setFastFee() {
    if (props.fastFee) {
      props.setData({
        ...props.transactionData,
        fee: props.fastFee,
      });
    } else {
      props.setData({
        ...props.transactionData,
        fee: 0.1,
      });
    }
  }

  function addressHandler(address) {
    props.setData({
      ...props.transactionData,
      address,
    });
  }

  function amountHandler(amount) {
    if (amount < 0.0000001 && amount !== 0) {
      // TODO : Put big.js
      props.showToast(
        `Amount ${amount} is less than the minimum amount (0.00000001)`
      );
    } else {
      props.setData({
        ...props.transactionData,
        amount,
      });
    }
  }

  function feeHandler(fee) {
    if (fee < 0.001) {
      // TODO : Put big.js
      props.showToast(`Fee ${fee} is less than the minimum fee (0.001)`);
    } else {
      props.setData({
        ...props.transactionData,
        fee,
      });
    }
  }

  function memoHandler(memo) {
    props.setData({
      ...props.transactionData,
      memo,
    });
  }
}
