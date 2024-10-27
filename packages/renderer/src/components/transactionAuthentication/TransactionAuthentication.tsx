import {Col, Row} from 'react-bootstrap';
import {ArrowRight, Repeat} from 'react-feather';
import Button from '../UI/Button';
import Input from '../UI/input/Input';
import Spinner from '../UI/Spinner';
import PasswordDecrypt from '../PasswordDecrypt';
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation();

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
            <strong>{t('transaction_authentication.signature_failed')}</strong>
            <br />
          </div>
          <p className="mx-auto mb-5">{t('transaction_authentication.signature_failed_message')}</p>
          <Row>
            <Col xs={6}>
              <Button
                className="big-icon-button"
                text={t('transaction_authentication.go_back')}
                onClick={stepBackward}
              />
            </Col>
            <Col xs={6}>
              <Button
                text={t('transaction_authentication.retry')}
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
          <strong>{t('transaction_authentication.signing')}</strong>
          <br />
          <small>{t('transaction_authentication.waiting_for_ledger')}</small>
          <br />
          <small className="w-100 text-center mb-4">{t('transaction_authentication.waiting_time')}</small>
        </div>
      </div>
    </div>
  ) : (
    <div className="mx-auto  w-75">
      <div className="my-5">
        <div className="align-left mt-3 mb-2 label">
          <strong>{t('transaction_authentication.passphrase_private_key')}</strong>
          <br />
          <small>{t('transaction_authentication.insert_passphrase_private_key')}</small>
        </div>
        <Input
          inputHandler={e => setPrivateKey(e.currentTarget.value)}
          placeholder={t('transaction_authentication.insert_placeholder')}
          hidden={true}
          type="text"
        />
        <Row>
          <Col xs={6}>
            <Button
              className="big-icon-button"
              text={t('transaction_authentication.cancel')}
              onClick={stepBackwards}
            />
          </Col>
          <Col xs={6}>
            <Button
              text={t('transaction_authentication.send')}
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
