import {useState} from 'react';
import useSecureStorage from '../hooks/useSecureStorage';
import {toast} from 'react-toastify';
import Input from './UI/input/Input';
import {Col, Row} from 'react-bootstrap';
import Button from './UI/Button';
import {ArrowRight} from 'react-feather';

interface IPasswordDecrypt {
  onSuccess: (passphrase: string) => void;
  onClose: () => void;
}

export default function PasswordDecrypt({onSuccess, onClose}: IPasswordDecrypt) {
  const [password, setPassword] = useState('');
  const {decryptData} = useSecureStorage();

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  const disableButton = !passwordRegex.test(password);

  const onSubmitHandler = () => {
    try {
      const privateKey = decryptData(password);
      if (privateKey) {
        onSuccess(privateKey);
      } else {
        toast.error('Wrong password');
      }
    } catch (error) {
      toast.error('Wrong password');
    }
  };

  return (
    <div>
      <p className="mt-3 text-center">Insert your password to proceed</p>
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
        <Col>
          <Button
            className="big-icon-button"
            text="Cancel"
            onClick={onClose}
          />
        </Col>
        <Col>
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
  );
}
