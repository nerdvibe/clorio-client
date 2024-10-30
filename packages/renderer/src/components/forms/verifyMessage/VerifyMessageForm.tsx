import {useEffect, useState} from 'react';
import {Col} from 'react-bootstrap';
import Button from '../../UI/Button';
import HelpHint from '../../UI/HelpHint';
import Input from '../../UI/input/Input';
import type {IMessageToVerify} from '../../../types/MessageToVerify';
import {CheckCircle} from 'react-feather';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {deeplinkState} from '/@/store';
import {DeeplinkType} from '/@/hooks/useDeeplinkHandler';
import { useTranslation } from 'react-i18next';

interface IProps {
  verifyMessage: (messageToVerify: IMessageToVerify) => void;
  initialData?: IMessageToVerify;
}

const VerifyForm = ({verifyMessage, initialData}: IProps) => {
  const [message, setMessage] = useState<string>(initialData?.message || '');
  const [address, setAddress] = useState<string>(initialData?.address || '');
  const [field, setField] = useState<string>(initialData?.field || '');
  const [scalar, setScalar] = useState<string>(initialData?.scalar || '');
  const deeplinkData = useRecoilValue(deeplinkState);
  const setDeeplinkData = useSetRecoilState(deeplinkState);
  const {t} = useTranslation();

  useEffect(() => {
    if (deeplinkData.type === DeeplinkType.VERIFY_MESSAGE && deeplinkData.data) {
      const {message, address, field, scalar} = deeplinkData.data;
      if (message && address && field && scalar) {
        setMessage(message);
        setAddress(address);
        setField(field);
        setScalar(scalar);
        setDeeplinkData({type: '', data: {}});
      }
    }
  }, [deeplinkData]);

  useEffect(() => {
    if (initialData) {
      setMessage(initialData.message || '');
      setAddress(initialData.address || '');
      setField(initialData.field || '');
      setScalar(initialData.scalar || '');
    }
  }, [initialData]);

  /**
   * If one between address,message,field or scalar is empty button is disabled
   * @returns boolean
   */
  const disableButton = () => {
    return !address || !message || !field || !scalar;
  };

  /**
   * Create the object containing the message to be verified and verify it
   */
  const createDataObjectAndVerify = () => {
    const messageToVerify = {
      message,
      address,
      field,
      scalar,
    };
    verifyMessage(messageToVerify);
  };

  return (
    <div className="mx-auto mb-2">
      <div className="glass-card p-4">
        <div className="animate__animated animate__fadeIn w-75 mx-auto ">
          <h2>
            {t('verify_message_form.verify_message')}{' '}
            <HelpHint hint={t('verify_message_form.help_hint')} />
          </h2>
          <div className="divider w-100" />
          <h5>
            <strong>{t('verify_message_form.message')}</strong>
          </h5>
          <div
            className="wrap-input1 validate-input"
            data-validate="Name is required"
          >
            <span className="icon" />
            <textarea
              name="message"
              id="message"
              onChange={e => setMessage(e.currentTarget.value)}
              value={message}
              placeholder={t('verify_message_form.message')}
            />
          </div>
          <h5>
            <strong>{t('verify_message_form.public_key')}</strong>
          </h5>
          <div
            className="wrap-input1 validate-input"
            data-validate="Name is required"
          >
            <span className="icon" />
            <Input
              className="input1"
              type="text"
              name="message"
              value={address}
              placeholder={t('verify_message_form.public_key')}
              inputHandler={e => setAddress(e.currentTarget.value)}
            />
          </div>
          <div className="flex verify-message-form gap-2">
            <Col>
              <h5>
                <strong>{t('verify_message_form.field')}</strong>
              </h5>
              <div
                className="wrap-input1 validate-input"
                data-validate="Name is required"
              >
                <textarea
                  name="field"
                  id="field"
                  onChange={e => setField(e.currentTarget.value)}
                  value={field}
                  placeholder={t('verify_message_form.field')}
                />
              </div>
            </Col>
            <Col>
              <h5>
                <strong>{t('verify_message_form.scalar')}</strong>
              </h5>
              <div className="wrap-input1 validate-input">
                <textarea
                  name="scalar"
                  id="scalar"
                  onChange={e => setScalar(e.currentTarget.value)}
                  value={scalar}
                  placeholder={t('verify_message_form.scalar')}
                />
              </div>
            </Col>
          </div>
          <Button
            text={t('verify_message_form.verify')}
            style="primary"
            className="fit-content px-5 mt-4"
            icon={<CheckCircle />}
            appendIcon
            onClick={createDataObjectAndVerify}
            disabled={disableButton()}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyForm;
