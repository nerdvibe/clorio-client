import {Col, Row} from 'react-bootstrap';
import {ArrowLeft, ArrowRight} from 'react-feather';
import Button from '../UI/Button';
import {useTranslation} from 'react-i18next';

interface IProps {
  publicKey: string;
  setSession: () => void;
}

const LedgerConfirmAddress = ({publicKey, setSession}: IProps) => {
  const {t} = useTranslation();

  return publicKey ? (
    <div className="min-width-500">
      <div className="align-left mt-3 mb-2 label">
        <strong>{t('ledger_confirm_address.public_key')}</strong>
      </div>
      <div className="wrap-input1 validate-input passphrase-box">
        <h5 className="w-100 pl-3 selectable-text mb-0 px-2">{publicKey}</h5>
      </div>
      <p className="full-width-align-center my-4">{t('ledger_confirm_address.confirm_address')}</p>
      <Row className="mt-4">
        <Col xs={6}>
          <Button
            className="big-icon-button"
            icon={<ArrowLeft />}
            text={t('ledger_confirm_address.go_back')}
            link="/login-selection"
          />
        </Col>
        <Col xs={6}>
          <Button
            onClick={setSession}
            text={t('ledger_confirm_address.access_wallet')}
            style="primary"
            icon={<ArrowRight />}
            appendIcon
          />
        </Col>
      </Row>
    </div>
  ) : (
    <></>
  );
};

export default LedgerConfirmAddress;
