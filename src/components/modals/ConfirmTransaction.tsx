import { Row, Col } from "react-bootstrap";
import { ITransactionData } from "../../models/TransactionData";
import { toLongMINA } from "../../tools";
import Button from "../UI/Button";

interface IProps{
  transactionData:ITransactionData,
  sendTransaction: () => void,
  stepBackward: () => void
}

const ConfirmTransaction = (props:IProps) => {
  const { amount, fee, receiverAddress, memo } = props.transactionData;
  const { stepBackward, sendTransaction } = props;
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
              {memo ? <>with memo <strong>{memo}</strong></> : null}
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

export default ConfirmTransaction;
