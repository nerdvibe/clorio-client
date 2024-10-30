import {useTranslation} from 'react-i18next';
import type {ISignature} from '../../../types/Signature';

interface IProps {
  signature: ISignature;
  publicKey: string;
  data: string;
  reset: () => void;
}

const SignMessageResult = ({publicKey, data, signature}: IProps) => {
  const {t} = useTranslation();
  const {field, scalar} = signature;
  return (
    <div className="mx-auto">
      <div className="">
        <div className="transaction-form animate__animated animate__fadeIn mb-0 mt-2 ">
          <h5 className="mb-4">
            <strong>{t('sign_message_result.your_signed_message')}</strong>
          </h5>
          <div className="signed-message-container my-auto selectable-text">
            <p className="selectable-text">{t('sign_message_result.message_header')}</p>
            <p className="selectable-text">{data}</p>
            <p className="selectable-text">{t('sign_message_result.public_key_header')}</p>
            <p className="selectable-text">{publicKey}</p>
            <p className="selectable-text">{t('sign_message_result.field_header')}</p>
            <p className="selectable-text">{field}</p>
            <p className="selectable-text">{t('sign_message_result.scalar_header')}</p>
            <p className="selectable-text">{scalar}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignMessageResult;
