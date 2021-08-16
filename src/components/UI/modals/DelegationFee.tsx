import { toast } from "react-toastify";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { feeOrDefault } from "../../../tools/fees";
import {
  toMINA,
  toNanoMINA,
  feeGreaterThanMinimum,
  MINIMUM_FEE,
  DELEGATION_FEE_THRESHOLD,
} from "../../../tools";
import Button from "../Button";
import Input from "../input/Input";
import { IEstimatedFee } from "../../../types/Fee";

interface IProps {
  proceedHandler: (fee: number) => void;
  closeModal: () => void;
  fees?: {
    estimatedFee: IEstimatedFee;
  };
}

export const DelegationFee = ({ proceedHandler, fees }: IProps) => {
  const averageFee = feeOrDefault(fees?.estimatedFee?.txFees?.average || 0);
  const fastFee = feeOrDefault(fees?.estimatedFee?.txFees?.fast || 0);
  const [fee, setFee] = useState<number>(feeOrDefault(averageFee));
  const [highFeeWarning, setHighFeeWarning] = useState<boolean>(false);

  /**
   * If the selected fee is less than the minimum show an error alert, otherwise proceed
   */
  const proceedButtonHandler = (acceptWarning?: boolean) => {
    // Check if the fee is higher than the 2 Mina threshold
    setHighFeeWarning(toNanoMINA(fee) >= DELEGATION_FEE_THRESHOLD);
    if (toNanoMINA(fee) >= DELEGATION_FEE_THRESHOLD && !acceptWarning) {
      return;
    }
    if (feeGreaterThanMinimum(fee)) {
      // Block the user if the fee is more than 2 Mina and the user did not agree with the warning
      if (highFeeWarning && !acceptWarning) {
        return;
      }
      const feeToSend = toNanoMINA(fee);
      proceedHandler(feeToSend);
      return;
    }
    const message = `Fee ${fee} is less than the minimum fee (${toMINA(
      MINIMUM_FEE
    )})`;
    toast.error(message);
  };

  const highFeeWarningContent = () => (
    <div>
      <h2>This transaction fee seems too high</h2>
      <div className="v-spacer" />
      <div className="">
        <h6>
          Are you sure that you want to pay this transaction with {fee} Mina?{" "}
          <br />
          This is just the transaction fee, it&apos;s not the amount that you
          are going to delegate.
        </h6>
      </div>
      <div className="v-spacer" />
      <div className="v-spacer" />
      <div className="half-width-block">
        <Button
          className="lightGreenButton__fullMono mx-auto"
          onClick={() => setHighFeeWarning(false)}
          text="Cancel"
        />
      </div>
      <Button
        className="link-button mx-auto small-proceed-button"
        onClick={() => proceedButtonHandler(true)}
        text="Proceed"
      />
    </div>
  );

  return highFeeWarning ? (
    highFeeWarningContent()
  ) : (
    <div>
      <h2>Insert a Fee</h2>
      <div className="v-spacer" />
      <div className="half-width-block">
        <Row>
          <Col md={4} className="align-initial">
            <h3 className="inline-element">Fee</h3>
          </Col>
          <Col className="fee-label">
            <Button
              className="link-button align-end  no-padding"
              text="Average"
              onClick={() => setFee(averageFee)}
            />
          </Col>
          <Col className="fee-label">
            <Button
              className="link-button align-end  no-padding"
              text="Fast"
              onClick={() => setFee(fastFee)}
            />
          </Col>
        </Row>
        <Input
          placeholder="Enter a fee "
          value={fee}
          inputHandler={(e) => setFee(+e.target.value)}
          type="number"
        />
      </div>
      <div className="v-spacer" />
      <Button
        className="lightGreenButton__fullMono mx-auto"
        onClick={() => proceedButtonHandler()}
        text="Proceed"
      />
    </div>
  );
};
