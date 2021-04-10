import { toast } from "react-toastify";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { feeOrDefault } from "../../tools/fees";
import {
  toMINA,
  toNanoMINA,
  feeGreaterThanMinimum,
  MINIMUM_FEE,
} from "../../tools";
import Button from "../UI/Button";
import Input from "../UI/input/Input";
import { IEstimatedFee } from "../../types/Fee";

interface IProps {
  proceedHandler: (fee: number) => void;
  closeModal: () => void;
  fees?: {
    estimatedFee: IEstimatedFee;
  };
}

const DelegationFee = ({ proceedHandler, fees }: IProps) => {
  const averageFee = feeOrDefault(fees?.estimatedFee?.txFees?.average || 0);
  const fastFee = feeOrDefault(fees?.estimatedFee?.txFees?.fast || 0);
  const [fee, setFee] = useState<number>(feeOrDefault(averageFee));

  /**
   * If the selected fee is less than the minimum show an error alert, otherwise close the modal
   */
  const proceedButtonHandler = () => {
    if (feeGreaterThanMinimum(fee)) {
      const feeToSend = toNanoMINA(fee);
      proceedHandler(feeToSend);
      return;
    }
    const message = `Fee ${fee} is less than the minimum fee (${toMINA(
      MINIMUM_FEE,
    )})`;
    toast.error(message);
  };

  return (
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
          inputHandler={e => setFee(+e.target.value)}
          type="number"
        />
      </div>
      <div className="v-spacer" />
      <Button
        className="lightGreenButton__fullMono mx-auto"
        onClick={proceedButtonHandler}
        text="Proceed"
      />
    </div>
  );
};

export default DelegationFee;
