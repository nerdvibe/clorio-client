import {toast} from 'react-toastify';
import Hoc from '../components/UI/Hoc';
import VerifyForm from '../components/forms/verifyMessage/VerifyMessageForm';
import type {IMessageToVerify} from '../types/MessageToVerify';
import ReactTooltip from 'react-tooltip';
import {client} from '../tools';

function VerifyMessage() {
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
          toast.success('Message is valid');
        } else {
          toast.error('Message is not valid');
        }
      }
    } catch (e) {
      toast.error('Message is not valid');
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
