import {Col, Row} from 'react-bootstrap';
import Button from './UI/Button';
import Input from './UI/input/Input';
import {ModalContainer} from './UI/modals';
import {useState} from 'react';
import {ArrowLeft, ArrowRight} from 'react-feather';

interface ISecureDataStorageComponent {
  show: boolean;
  onClose: () => void;
  onSubmit: (key: string) => void;
}

function SecureDataStorageComponent({show, onClose, onSubmit}: ISecureDataStorageComponent) {
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
            <h1>Create password</h1>
            <p className="text-center mt-1">
              We will encrypt your credentials and with the following password you&apos;ll be able to
              access your wallet.
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
          The password must be at least 6 characters long, it must contain at least a number and at
          least one special character (!@#$%^&*).
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
              text="Cancel"
              onClick={onCloseHandler}
            />
          </Col>
          <Col xs={6}>
            <Button
              onClick={onSubmitHandler}
              text="Confirm"
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
