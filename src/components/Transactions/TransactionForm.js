import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { MINIMUM_AMOUNT, MINIMUM_FEE } from "../../tools/const";
import { toMINA, toNanoMINA } from "../../tools/utils";
import Button from "../general/Button";
import Input from "../general/input/Input";
import { toast } from 'react-toastify';


export default function TransactionForm(props) {
  const [amount, setAmount] = useState(toMINA(props.transactionData.amount));
  const [fee, setFee] = useState(toMINA(props.transactionData.fee));

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

  function addressHandler(receiverAddress) {
    props.setData({
      ...props.transactionData,
      receiverAddress,
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
      toast.error("Memo is limited to 32 characters")
    } else {
      return props.setData({
        ...props.transactionData,
        memo,
      });
    }
  }

  function checkFieldsAndProceed() {
    const { amount, fee, receiverAddress } = props.transactionData;
    if (amount < MINIMUM_AMOUNT || amount === 0) {
      const message = `Amount ${toMINA(
        amount
      )} is less than the minimum amount (${toMINA(MINIMUM_AMOUNT)})`;
      return toast.error(message)
    }
    if (fee < MINIMUM_FEE) {
      const message = `Fee ${toMINA(
        fee
      )} is less than the minimum fee (${toMINA(MINIMUM_FEE)})`;
      return toast.error(message)
    }
    if (receiverAddress === "") {
      return toast.error("Please insert a recipient")
    }
    return props.nextStep();
  }

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
                value={props.transactionData.receiverAddress}
                placeholder="Enter address "
                inputHandler={(e) => addressHandler(e.currentTarget.value)}
              />
              <h3>Memo</h3>
              <Input
                value={props.transactionData.memo}
                placeholder="Enter memo "
                inputHandler={(e) => memoHandler(e.currentTarget.value)}
              />
              <Row>
                <Col md={12} xl={6}>
                  <h3>Amount</h3>
                  <Input
                    placeholder="Enter an amount "
                    value={amount}
                    inputHandler={(e) => amountHandler(e.target.value)}
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
                onClick={checkFieldsAndProceed}
                text="Preview"
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
