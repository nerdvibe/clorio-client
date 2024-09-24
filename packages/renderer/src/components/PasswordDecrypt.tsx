import { useEffect, useState } from 'react';
import useSecureStorage from '../hooks/useSecureStorage';
import { toast } from 'react-toastify';
import Input from './UI/input/Input';
import { Col, Row } from 'react-bootstrap';
import Button from './UI/Button';
import { ArrowRight } from 'react-feather';
import { useTranslation } from 'react-i18next';

interface IPasswordDecrypt {
  onSuccess: (passphrase: string) => void;
  onClose: () => void;
}

export default function PasswordDecrypt({ onSuccess, onClose }: IPasswordDecrypt) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const { decryptData } = useSecureStorage();

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  const disableButton = !passwordRegex.test(password);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        onSubmitHandler();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [password]);

  const onSubmitHandler = () => {
    try {
      const privateKey = decryptData(password);
      if (privateKey) {
        onSuccess(privateKey);
      } else {
        toast.error(t('password_decrypt.wrong_password'));
      }
    } catch (error) {
      toast.error(t('password_decrypt.wrong_password'));
    }
  };

  return (
    <div>
      <p className="mt-3 text-center">{t('password_decrypt.insert_your_password_to_proceed')}</p>
      <div className="password-input">
        <Input
          type="text"
          hidden
          value={password}
          inputHandler={e => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div className="v-spacer" />
      <Row>
        <Col>
          <Button
            className="big-icon-button"
            text={t('password_decrypt.cancel')}
            onClick={onClose}
          />
        </Col>
        <Col>
          <Button
            onClick={onSubmitHandler}
            text={t('password_decrypt.confirm')}
            style="primary"
            icon={<ArrowRight />}
            disabled={disableButton}
            appendIcon
          />
        </Col>
      </Row>
    </div>
  );
}
