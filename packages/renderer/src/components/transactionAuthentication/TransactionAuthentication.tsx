import {Col, Row} from 'react-bootstrap';
import {ArrowRight, Repeat} from 'react-feather';
import Button from '../UI/Button';
import Input from '../UI/input/Input';
import Spinner from '../UI/Spinner';
import PasswordDecrypt from '../PasswordDecrypt';

interface IProps {
  isLedgerEnabled?: boolean;
  ledgerError?: boolean;
  storedPassphrase?: boolean;
  retryLedgerTransaction: () => void;
  setPrivateKey: (privateKey: string) => void;
  stepBackwards?: () => void;
  confirmPrivateKey?: (passphrase?: string) => void;
  stepBackward: () => void;
}

const TransactionAuthentication = ({
  isLedgerEnabled,
  confirmPrivateKey,
  setPrivateKey,
  stepBackwards,
  ledgerError,
  stepBackward,
  retryLedgerTransaction,
  storedPassphrase,
}: IProps) => {
  if (storedPassphrase) {
    return (
      <PasswordDecrypt
        onClose={stepBackward}
        onSuccess={(passphrase: string) => {
          confirmPrivateKey(passphrase);
        }}
      />
    );
  }

  if (isLedgerEnabled && ledgerError) {
    return (
      <div className="mx-auto  w-75">
        <div className="my-4 ">
          <div className="align-left mt-3 mb-2 label text-center">
            <strong>Signature failed</strong>
            <br />
          </div>
          <p className="mx-auto mb-5">The signature process through the ledger failed</p>
          <Row>
            <Col xs={6}>
              <Button
                className="big-icon-button"
                text="Go back"
                onClick={stepBackward}
              />
            </Col>
            <Col xs={6}>
              <Button
                text="Retry"
                style="primary"
                icon={<Repeat />}
                appendIcon
                onClick={retryLedgerTransaction}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  return isLedgerEnabled ? (
    <div className="mx-auto  w-75">
      <div className="my-5">
        <div className="spinner-container">
          <Spinner
            show={true}
            fullscreen={false}
          />
        </div>
        <div className="align-left mt-3 mb-2 label text-center">
          <strong>Signing</strong>
          <br />
          <small>Waiting for the Ledger device to sign the transaction</small>
          <br />
          <small className="w-100 text-center mb-4">This could take up to 3 minutes.</small>
        </div>
      </div>
    </div>
  ) : (
    <div className="mx-auto  w-75">
      <div className="my-5">
        <div className="align-left mt-3 mb-2 label">
          <strong>Passphrase/Private key</strong>
          <br />
          <small>Insert the Passphrase/Private key to sign the transaction</small>
        </div>
        <Input
          inputHandler={e => setPrivateKey(e.currentTarget.value)}
          placeholder="Insert your Passphrase or Private key"
          hidden={true}
          type="text"
        />
        <Row>
          <Col xs={6}>
            <Button
              className="big-icon-button"
              text="Cancel"
              onClick={stepBackwards}
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
    </div>
  );
};

export default TransactionAuthentication;
