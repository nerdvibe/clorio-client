import { Col, Row } from 'react-bootstrap';
import { ArrowRight } from 'react-feather';
import Button from '../Button';
import Input from '../input/Input';

interface IProps {
  subtitle?: string;
  setPrivateKey: (privateKey: string) => void;
  closeModal: () => void;
  confirmPrivateKey: () => void;
}

export const PrivateKeyModal = ({
  subtitle,
  setPrivateKey,
  closeModal,
  confirmPrivateKey,
}: IProps) => (
  <div className="min-width-500">
    <div className="w-100">
      <div className="flex flex-col flex-vertical-center">
        <h1 className="mb-0">Passphrase or Private key </h1>
        <p className="my-2">
          To confirm the transaction insert the passphrase or private key
        </p>
        <div className="divider w-100" />
      </div>
    </div>
    {subtitle && <p>{subtitle}</p>}
    <Input
      inputHandler={(e) => setPrivateKey(e.currentTarget.value)}
      placeholder="Insert your Passphrase or Private key"
      hidden={true}
      type="text"
    />
    <Row>
      <Col xs={6}>
        <Button
          className="big-icon-button"
          text="Cancel"
          onClick={closeModal}
        />
      </Col>
      <Col xs={6}>
        <Button
          text="Send"
          style="primary"
          icon={<ArrowRight />}
          appendIcon
          onClick={confirmPrivateKey}
        />
      </Col>
    </Row>
  </div>
);
