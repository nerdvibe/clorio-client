import { Col, Row } from "react-bootstrap";
import Button from "../Button";
import Input from "../input/Input";
import Logo from "../logo/Logo";

interface IProps {
  setValidationText: (text: string) => void;
  stepBackwards: () => void;
  setAuthorization: () => void;
  checkButtonState: () => boolean;
}

const ValidationStep = ({
  setValidationText,
  stepBackwards,
  setAuthorization,
  checkButtonState,
}: IProps) => (
  <div className="full-width">
    <div className="mx-auto medium-size-box">
      <div className="mx-auto fit-content">
        <Logo big={true} />
      </div>
      <div className="v-spacer no-print" />
      <div className="v-spacer" />
      <h4 className="full-width-align-center">Verify your Private key</h4>
      <div className="v-spacer" />
      <div className="wrap-input1 validate-input">
        <h5 className="full-width-align-center">
          <Input
            inputHandler={e => setValidationText(e.currentTarget.value)}
            placeholder="Private key"
          />
        </h5>
      </div>
      <div className="v-spacer" />
      <Row className="no-print">
        <Col xs={6}>
          <Button
            className="link-button mx-auto"
            text="Cancel"
            onClick={stepBackwards}
          />
        </Col>
        <Col xs={6}>
          <Button
            className="lightGreenButton__fullMono mx-auto"
            onClick={setAuthorization}
            text="Continue"
            disabled={checkButtonState()}
            link="/overview"
          />
        </Col>
      </Row>
    </div>
  </div>
);

export default ValidationStep;
