import {useEffect, useState} from 'react';
import {Col} from 'react-bootstrap';
import Button from '../../UI/Button';
import HelpHint from '../../UI/HelpHint';
import Input from '../../UI/input/Input';
import type {IMessageToVerify} from '../../../types/MessageToVerify';
import {CheckCircle} from 'react-feather';

interface IProps {
  verifyMessage: (messageToVerify: IMessageToVerify) => void;
  initialData?: IMessageToVerify;
}

const VerifyForm = ({verifyMessage, initialData}: IProps) => {
  const [message, setMessage] = useState<string>(initialData?.message || '');
  const [address, setAddress] = useState<string>(initialData?.address || '');
  const [field, setField] = useState<string>(initialData?.field || '');
  const [scalar, setScalar] = useState<string>(initialData?.scalar || '');

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
            Verify message{' '}
            <HelpHint hint="Paste the signature message in the fields in order to verify the cryptographic authenticity." />
          </h2>
          <div className="divider w-100" />
          <h5>
            <strong>Message</strong>
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
              placeholder="Message "
            />
          </div>
          <h5>
            <strong>Public key</strong>
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
              placeholder="Public key "
              inputHandler={e => setAddress(e.currentTarget.value)}
            />
          </div>
          <div className="flex verify-message-form gap-2">
            <Col>
              <h5>
                <strong>Field</strong>
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
                  placeholder="Field "
                />
              </div>
            </Col>
            <Col>
              <h5>
                <strong>Scalar</strong>
              </h5>
              <div className="wrap-input1 validate-input">
                <textarea
                  name="scalar"
                  id="scalar"
                  onChange={e => setScalar(e.currentTarget.value)}
                  value={scalar}
                  placeholder="Scalar "
                />
              </div>
            </Col>
          </div>
          <Button
            text="Verify"
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
