import {toast} from 'react-toastify';
import {useState} from 'react';
import {Col, Row} from 'react-bootstrap';
import {feeOrDefault} from '../../../tools/fees';
import {
  toMINA,
  toNanoMINA,
  feeGreaterThanMinimum,
  MINIMUM_FEE,
  DELEGATION_FEE_THRESHOLD,
} from '../../../tools';
import Button from '../Button';
import Input from '../input/Input';
import type {IEstimatedFee} from '../../../types/Fee';
import {ArrowLeft, ArrowRight} from 'react-feather';

interface IProps {
  proceedHandler: (fee: number) => void;
  closeModal: () => void;
  fees?: {
    estimatedFee: IEstimatedFee;
  };
}

export const DelegationFee = ({proceedHandler, fees, closeModal}: IProps) => {
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
    const message = `Fee ${fee} is less than the minimum fee (${toMINA(MINIMUM_FEE)})`;
    toast.error(message);
  };

  const highFeeWarningContent = () => (
    <div className="min-width-500">
      <div className="flex flex-col flex-vertical-center">
        <h1 className="text-center mb-0">Fee too high</h1>
        <div className="divider" />
      </div>
      <p className="text-center">
        Are you sure that you want to pay
        <br /> this transaction with <strong>{fee}</strong> Mina? <br />
      </p>
      <p className="text-center mb-4">
        This is just the transaction fee, it&apos;s not <br /> the amount that you are going to
        delegate.
      </p>
      <Row>
        <Col xs={6}>
          <Button
            className="big-icon-button"
            text="Cancel"
            onClick={() => setHighFeeWarning(false)}
          />
        </Col>
        <Col xs={6}>
          <Button
            text="Proceed"
            style="primary"
            icon={<ArrowRight />}
            appendIcon
            onClick={() => proceedButtonHandler(true)}
          />
        </Col>
      </Row>
    </div>
  );

  return highFeeWarning ? (
    highFeeWarningContent()
  ) : (
    <div className="min-width-500">
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1 className="mb-0">Insert a Fee </h1>
          <p className="text-center mt-1 mb-1">Select a fee for the delegation transaction</p>
          <div className="divider w-100" />
        </div>
      </div>
      <div className="w-75 mx-auto">
        <div className="flex flex-row justify-between">
          <div className="align-left mt-1 mb-2 label">
            <strong>Fee</strong>
          </div>
          <div className="fee-label flex flex-row ">
            <Button
              className="link-button custom-delegate-button purple-text align-end  no-padding"
              text="Avg"
              onClick={() => setFee(averageFee)}
            />
            <Button
              className="link-button custom-delegate-button purple-text align-end  no-padding"
              text="Fast"
              onClick={() => setFee(fastFee)}
            />
          </div>
        </div>
        <Input
          placeholder="Enter a fee "
          value={fee}
          inputHandler={e => setFee(+e.target.value)}
          type="number"
        />
        <Row>
          <Col xs={6}>
            <Button
              className="big-icon-button"
              icon={<ArrowLeft />}
              text="Cancel"
              onClick={closeModal}
            />
          </Col>
          <Col xs={6}>
            <Button
              text="Proceed"
              style="primary"
              icon={<ArrowRight />}
              appendIcon
              onClick={() => proceedButtonHandler()}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};
