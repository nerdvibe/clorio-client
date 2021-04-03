import { Col, Row } from "react-bootstrap";
import Button from "../UI/Button";
import Input from "../UI/input/Input";

interface IProps{
  subtitle:string,
  setPrivateKey:(privateKey:string)=>void,
  closeModal:()=>void,
  confirmPrivateKey:()=>void
}

const PrivateKeyModal = (props:IProps) => {
  const {subtitle,setPrivateKey,closeModal,confirmPrivateKey} = props
  return (
    <div className="mx-auto">
      <h2>Insert Private Key</h2>
      <div className="v-spacer" />
      {subtitle && <h5>{subtitle}</h5>}
      <div className="v-spacer" />
      <h5 className="align-center mx-auto">
        In order to continue please insert your private key
      </h5>
      <div className="v-spacer" />
      <Input
        inputHandler={(e) => setPrivateKey(e.currentTarget.value)}
        placeholder="Insert your private key"
      />
      <div className="v-spacer" />
      <Row>
        <Col xs={6}>
          <Button
            onClick={closeModal}
            className="link-button"
            text="Cancel"
          />
        </Col>
        <Col xs={6}>
          <Button
            onClick={confirmPrivateKey}
            className="lightGreenButton__fullMono mx-auto"
            text="Confirm"
          />
        </Col>
      </Row>
    </div>
  );
}

export default PrivateKeyModal;
