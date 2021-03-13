import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { toMINA, toNanoMINA } from "../tools/utils";
import Button from "./Button";
import Input from "./Input";

const MINIMUM_AMOUNT = toNanoMINA(0.0000001);
const MINIMUM_FEE = toNanoMINA(0.001);

export default function TransactionForm(props) {
  const [amount, setAmount] = useState(toMINA(props.transactionData.amount));
  const [fee, setFee] = useState(toMINA(props.transactionData.fee));
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
                <Col md={6}>
                  <h3>Amount</h3>
                  <Input
                    placeholder="Enter an amount "
                    value={amount}
                    inputHandler={(e) => amountHandler(e.target.value)}
                    type="number"
                  />
                </Col>
                <Col md={6}>
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
                    placeholder="Enter a fee "
                    value={fee}
                    inputHandler={(e) => feeHandler(e.target.value)}
                    type="number"
                  />
                </Col>
              </Row>
              <div className="v-spacer" />
              <Button
                className="lightGreenButton__fullMono mx-auto"
                onClick={amountCheck}
                text="Preview"
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );

  function setDefaultFee() {
    const fee = props.defaultFee;
    if (props.defaultFee) {
      setFee(fee);
      props.setData({
        ...props.transactionData,
        fee: toNanoMINA(props.defaultFee),
      });
    } else {
      setFee(0.1);
      props.setData({
        ...props.transactionData,
        fee: toNanoMINA(0.1),
      });
    }
  }

  function setFastFee() {
    const fee = props.fastFee;
    if (fee) {
      setFee(fee);
      props.setData({
        ...props.transactionData,
        fee: toNanoMINA(fee),
      });
    } else {
      setFee(0.1);
      props.setData({
        ...props.transactionData,
        fee: toNanoMINA(0.1),
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
    setAmount(amount);
    if (amount) {
      return props.setData({
        ...props.transactionData,
        amount: toNanoMINA(amount),
      });
    }
    return props.setData({
      ...props.transactionData,
      amount: toNanoMINA(0),
    });
  }

  function feeHandler(fee) {
    setFee(fee);
    if (fee) {
      return props.setData({
        ...props.transactionData,
        fee: toNanoMINA(fee),
      });
    }
    return props.setData({
      ...props.transactionData,
      fee: toNanoMINA(0),
    });
  }

  function memoHandler(memo) {
    if (memo.length > 32) {
      return props.showToast(`Memo is limited to 32 characters`);
    } else {
      return props.setData({
        ...props.transactionData,
        memo,
      });
    }
  }

  function amountCheck() {
    const { amount, fee } = props.transactionData;
    if (amount < MINIMUM_AMOUNT || amount === 0) {
      return props.showToast(
        `Amount ${toMINA(amount)} is less than the minimum amount (${toMINA(
          MINIMUM_AMOUNT
        )})`
      );
    }
    if (fee < MINIMUM_FEE) {
      return props.showToast(
        `Fee ${toMINA(fee)} is less than the minimum fee (${toMINA(
          MINIMUM_FEE
        )})`
      );
    }
    return props.nextStep();
  }
}
