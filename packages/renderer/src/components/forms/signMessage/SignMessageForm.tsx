import {useContext, useEffect, useState} from 'react';
import {client, deriveAccount, getPassphrase} from '../../../tools';
import Button from '../../UI/Button';
import HelpHint from '../../UI/HelpHint';
import Input from '../../UI/input/Input';
import SignMessageResult from './SignMessageResult';
import type {ILedgerContext} from '../../../contexts/ledger/LedgerTypes';
import {LedgerContext} from '../../../contexts/ledger/LedgerContext';
import type {IKeypair, IMessageToSign} from '../../../types';
import {toast} from 'react-toastify';
import SignMessageLedgerScreen from '../../UI/signMessage/SignMessageLedgerScreen';
import {Edit3} from 'react-feather';
import useSecureStorage from '/@/hooks/useSecureStorage';
import {useWallet} from '/@/contexts/WalletContext';
import {useTranslation} from 'react-i18next';

const SignMessageForm = () => {
  const [message, setMessage] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [password, setPassword] = useState('');
  const [storedPassphrase, setStoredPassphrase] = useState('');
  const {decryptData} = useSecureStorage();
  const {wallet} = useWallet();
  const {t} = useTranslation();

  const [result, setResult] = useState({
    data: '',
    signature: {
      scalar: '',
      field: '',
    },
    publicKey: '',
  });

  useEffect(() => {
    getPassphrase().then(passphrase => {
      setStoredPassphrase(passphrase);
    });
  }, []);

  const {isLedgerEnabled} = useContext<Partial<ILedgerContext>>(LedgerContext);

  /**
   * If fields are not empty, sign the message and set the result inside the component state
   */
  const submitHandler = async (messageToSign: IMessageToSign) => {
    try {
      const derivedKeypair = await deriveAccount(
        messageToSign.privateKey,
        wallet?.accountNumber || 0,
      );
      const keypair = {
        publicKey: derivedKeypair.publicKey,
        privateKey: derivedKeypair.privateKey,
      } as IKeypair;
      const result = (await client()).signMessage(messageToSign.message, keypair.privateKey);
      setResult(result);
    } catch (e) {
      toast.error('Please check the passphrase/private key');
    }
  };

  /**
   * Clear form data from state
   */
  const resetForm = () => {
    setResult({
      data: '',
      signature: {
        scalar: '',
        field: '',
      },
      publicKey: '',
    });
  };

  /**
   * Clean component state on component dismount
   */
  useEffect(() => {
    return () => {
      setMessage('');
      setPrivateKey('');
    };
  }, []);

  /**
   * Check if message and Passphrase/Private key are not empty
   * @returns boolean
   */
  const signButtonStateHandler = () => {
    return !message || (!privateKey && !password);
  };

  /**
   * Create the object to be signed and sign it
   */
  const createObjectAndSign = () => {
    let storedPrivateKey;
    if (password) {
      storedPrivateKey = decryptData(password);
    }
    const messageToSign = {
      message,
      privateKey: storedPrivateKey || privateKey,
    };
    submitHandler(messageToSign);
  };

  if (isLedgerEnabled) {
    return <SignMessageLedgerScreen />;
  }

  return (
    <div className="mx-auto mb-2">
      <div className="glass-card p-4">
        <div className="animate__animated animate__fadeIn align-left w-75 mx-auto">
          <h2>
            {t('sign_message_form.sign_message')}{' '}
            <HelpHint hint={t('sign_message_form.cryptographically_sign_message')} />
          </h2>
          <div className="divider w-100" />
          <h5>
            <strong>{t('sign_message_form.message')}</strong>
          </h5>
          <div
            className="wrap-input1 validate-input"
            data-validate={t('sign_message_form.name_is_required')}
          >
            <span className="icon" />
            <textarea
              name="message"
              id="message"
              onChange={(e: any) => setMessage(e.currentTarget.value)}
              value={message}
              placeholder={t('sign_message_form.message')}
            />
          </div>
          {storedPassphrase ? (
            <>
              <h5>
                <strong>{t('sign_message_form.password')}</strong>
              </h5>
              <div
                className="wrap-input1 validate-input"
                data-validate={t('sign_message_form.name_is_required')}
              >
                <Input
                  type="text"
                  hidden
                  value={password}
                  inputHandler={e => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <h5>
                <strong>{t('sign_message_form.passphrase_or_private_key')}</strong>
              </h5>
              <div
                className="wrap-input1 validate-input"
                data-validate={t('sign_message_form.name_is_required')}
              >
                <span className="icon" />
                <Input
                  name="privateKey"
                  value={privateKey}
                  placeholder={t('sign_message_form.passphrase_or_private_key')}
                  inputHandler={e => setPrivateKey(e.currentTarget.value)}
                  hidden={true}
                  type="text"
                />
              </div>
            </>
          )}
          <div className="fit-content mx-auto">
            <Button
              text={t('sign_message_form.sign')}
              style="primary"
              className="fit-content px-5 mt-4"
              icon={<Edit3 />}
              appendIcon
              onClick={createObjectAndSign}
              disabled={signButtonStateHandler()}
            />
          </div>
          <div>
            {result.data ? (
              <>
                <div className="divider w-100 mt-4" />
                <SignMessageResult
                  {...result}
                  reset={resetForm}
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignMessageForm;
