import {Col, Row} from 'react-bootstrap';
import Button from './UI/Button';
import Input from './UI/input/Input';
import {ModalContainer} from './UI/modals';
import {useState} from 'react';
import {ArrowLeft, ArrowRight} from 'react-feather';
import {useTranslation} from 'react-i18next';

interface ISecureDataStorageComponent {
  show: boolean;
  onClose: () => void;
  onSubmit: (key: string) => void;
}

function SecureDataStorageComponent({show, onClose, onSubmit}: ISecureDataStorageComponent) {
  const {t} = useTranslation();
  const [password, setPassword] = useState('');

  const onCloseHandler = () => {
    setPassword('');
    onClose();
  };

  const onSubmitHandler = () => {
    onSubmit(password);
  };

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  const disableButton = !passwordRegex.test(password);

  return (
    <ModalContainer show={show}>
      <div className='max-w-600'>
        <div className="w-100 ">
          <div className="flex flex-col flex-vertical-center">
            <h1>{t('read_secure_storage.create_password')}</h1>
            <p className="text-center mt-1">
              {t('read_secure_storage.encrypt_credentials')}
              <br />
            </p>
            <div className="divider w-100" />
          </div>
        </div>
        <div className="v-spacer" />
        <p
          className="text-center"
          style={{fontSize: 'medium'}}
        >
          {t('read_secure_storage.password_requirements')}
        </p>
        <Input
          type="text"
          hidden
          value={password}
          inputHandler={e => {
            setPassword(e.target.value);
          }}
        />
        <div className="v-spacer" />
        <Row>
          <Col xs={6}>
            <Button
              className="big-icon-button"
              icon={<ArrowLeft />}
              text={t('read_secure_storage.cancel')}
              onClick={onCloseHandler}
            />
          </Col>
          <Col xs={6}>
            <Button
              onClick={onSubmitHandler}
              text={t('read_secure_storage.confirm')}
              style="primary"
              icon={<ArrowRight />}
              disabled={disableButton}
              appendIcon
            />
          </Col>
        </Row>
      </div>
    </ModalContainer>
  );
}

export default SecureDataStorageComponent;
