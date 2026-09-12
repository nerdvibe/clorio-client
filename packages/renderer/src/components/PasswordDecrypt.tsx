import {useEffect, useState} from 'react';
import useSecureStorage from '../hooks/useSecureStorage';
import {toast} from 'react-toastify';
import Input from './UI/input/Input';
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
        toast.error('Wrong password');
      }
    } catch (error) {
      toast.error('Wrong password');
    }
  };

  return (
    <div className="tx-auth__password-form">
      <label
        className="tx-auth__password-prompt"
        htmlFor="tx-auth-password"
      >
        Password
      </label>
      <div className="password-input">
        <Input
          id="tx-auth-password"
          type="text"
          hidden
          value={password}
          placeholder="Enter your password"
          inputHandler={e => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div className="v-spacer" />
      <div className="tx-auth__password-actions">
        <Button
          className="tx-auth__password-cancel"
          text="Cancel"
          onClick={onClose}
          style="ghost"
        />
        <Button
          className="tx-auth__password-confirm"
          onClick={onSubmitHandler}
          text="Confirm"
          style="primary"
          icon={<ArrowRight />}
          disabled={disableButton}
          appendIcon
        />
      </div>
    </div>
  );
}
