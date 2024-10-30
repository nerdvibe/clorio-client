import { Col, Row } from 'react-bootstrap';
import { ArrowRight } from 'react-feather';
import { useTranslation } from 'react-i18next';
import Button from '../Button';
import Input from '../input/Input';
import PasswordDecrypt from '../../PasswordDecrypt';

interface IProps {
  subtitle?: string;
  setPrivateKey: (privateKey: string) => void;
  closeModal: () => void;
  confirmPrivateKey: (passphrase?: string) => void;
  storedPassphrase?: boolean;
}

export const PrivateKeyModal = ({
  subtitle,
  setPrivateKey,
  closeModal,
  confirmPrivateKey,
  storedPassphrase,
}: IProps) => {
  const { t } = useTranslation();

  return storedPassphrase ? (
    <div className="min-width-500">
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1 className="mb-0">{t('private_key_modal.password_required')}</h1>
          <div className="divider w-100" />
        </div>
      </div>
      <PasswordDecrypt
        onClose={closeModal}
        onSuccess={passphrase => confirmPrivateKey(passphrase)}
      />
    </div>
  ) : (
    <div className="min-width-500">
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1 className="mb-0">{t('private_key_modal.passphrase_or_private_key')}</h1>
          <p className="my-2">{t('private_key_modal.description')}</p>
          <div className="divider w-100" />
        </div>
      </div>
      {subtitle && <p>{subtitle}</p>}
      <Input
        inputHandler={e => setPrivateKey(e.currentTarget.value)}
        placeholder={t('private_key_modal.placeholder')}
        hidden={true}
        type="text"
      />
      <Row>
        <Col xs={6}>
          <Button
            className="big-icon-button"
            text={t('private_key_modal.cancel_button')}
            onClick={closeModal}
          />
        </Col>
        <Col xs={6}>
          <Button
            text={t('private_key_modal.send_button')}
            style="primary"
            icon={<ArrowRight />}
            appendIcon
            onClick={confirmPrivateKey}
          />
        </Col>
      </Row>
    </div>
  );
};
