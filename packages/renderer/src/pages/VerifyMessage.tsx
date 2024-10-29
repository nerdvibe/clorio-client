import {toast} from 'react-toastify';
import Hoc from '../components/UI/Hoc';
import VerifyForm from '../components/forms/verifyMessage/VerifyMessageForm';
import type {IMessageToVerify} from '../types/MessageToVerify';
import ReactTooltip from 'react-tooltip';
import {client} from '../tools';
import {useTranslation} from 'react-i18next';

function VerifyMessage() {
  const {t} = useTranslation();

  const verifySignedMessage = async (messageToVerify: IMessageToVerify) => {
    const {address, message, field, scalar} = messageToVerify;
    try {
      if (message && message !== '') {
        const signedMessage = {
          publicKey: address,
          data: message,
          signature: {
            field,
            scalar,
          },
        };
        if ((await client()).verifyMessage(signedMessage)) {
          toast.success(t('verify_message.message_valid'));
        } else {
          toast.error(t('verify_message.message_invalid'));
        }
      }
    } catch (e) {
      toast.error(t('verify_message.message_invalid'));
    }
  };

  return (
    <Hoc>
      <VerifyForm verifyMessage={verifySignedMessage} />
      <ReactTooltip id="VerifyMessage" />
    </Hoc>
  );
}

export default VerifyMessage;
