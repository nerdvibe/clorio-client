import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { toMINA, toNanoMINA } from "../../../tools";
import Button from "../../UI/Button";
import Input from "../../UI/input/Input";
import { toast } from "react-toastify";
import { ITransactionData } from "../../../models/TransactionData";
import { checkFieldsAndProceed } from "./TransactionFormHelper";

interface IProps {
  transactionData: ITransactionData;
  defaultFee: number;
  fastFee: number;
  setData: (transactionData: ITransactionData) => void;
  nextStep: () => void;
}

const TransactionForm = (props: IProps) => {
  const { transactionData, defaultFee, fastFee, setData, nextStep } = props;
  const [amount, setAmount] = useState<string | number>(
    toMINA(transactionData.amount),
  );
  const [fee, setFee] = useState<string | number>(toMINA(transactionData.fee));

  const setDefaultFee = () => {
    const fee = defaultFee;
    if (defaultFee) {
      setFee(fee);
      setData({
        ...transactionData,
        fee: toNanoMINA(defaultFee),
      });
    } else {
      setFee(0.1);
      setData({
        ...transactionData,
        fee: toNanoMINA(0.1),
      });
    }
  };

  const setFastFee = () => {
    const fee = fastFee;
    if (fee) {
      setFee(fee);
      setData({
        ...transactionData,
        fee: toNanoMINA(fee),
      });
    } else {
      setFee(0.1);
      setData({
        ...transactionData,
        fee: toNanoMINA(0.1),
      });
    }
  };

  const addressHandler = (receiverAddress: string) => {
    setData({
      ...transactionData,
      receiverAddress,
    });
  };

  const amountHandler = (amount: string) => {
    setAmount(amount);
    if (amount) {
      return setData({
        ...transactionData,
        amount: toNanoMINA(amount),
      });
    }
    return setData({
      ...transactionData,
      amount: toNanoMINA(0),
    });
  };

  const feeHandler = (fee: string) => {
    setFee(fee);
    if (fee) {
      return setData({
        ...transactionData,
        fee: toNanoMINA(fee),
      });
    }
    return setData({
      ...transactionData,
      fee: toNanoMINA(0),
    });
  };

  const memoHandler = (memo: string) => {
    if (memo.length > 32) {
      toast.error("Memo is limited to 32 characters");
    } else {
      return setData({
        ...transactionData,
        memo,
      });
    }
  };

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
                value={transactionData.receiverAddress}
                placeholder="Enter address "
                inputHandler={e => addressHandler(e.currentTarget.value)}
              />
              <h3>Memo</h3>
              <Input
                value={transactionData.memo}
                placeholder="Enter memo "
                inputHandler={e => memoHandler(e.currentTarget.value)}
              />
              <Row>
                <Col md={12} xl={6}>
                  <h3>Amount</h3>
                  <Input
                    placeholder="Enter an amount "
                    value={amount}
                    inputHandler={e => amountHandler(e.target.value)}
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
                    inputHandler={e => feeHandler(e.target.value)}
                    type="number"
                  />
                </Col>
              </Row>
              <div className="v-spacer" />
              <Button
                className="lightGreenButton__fullMono mx-auto"
                onClick={() => checkFieldsAndProceed(transactionData, nextStep)}
                text="Preview"
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
