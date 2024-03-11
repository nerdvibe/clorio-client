import {useRecoilState} from 'recoil';
import {ModalContainer} from '../ModalContainer';
import {zkappState} from '/@/store';
import {sendResponse} from '/@/tools/mina-zkapp-bridge';
import Button from '../../Button';
import PasswordDecrypt from '/@/components/PasswordDecrypt';
import {useEffect, useRef, useState} from 'react';
import {client} from '/@/tools';
import Truncate from 'react-truncate-inside/es';
import {useWallet} from '/@/contexts/WalletContext';
import {mnemonicToPrivateKey} from '../../../../../../preload/src/bip';
import {toast} from 'react-toastify';

export default function SignMessage() {
  const fromRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [fromTextWidth, setFromTextWidth] = useState(0);
  const [
    {messageToSign, showMessageSign, isJsonMessageToSign, isNullifier, isFields},
    setZkappState,
  ] = useRecoilState(zkappState);

  const {wallet} = useWallet();
  const {address} = wallet;

  const responseChannel = isFields
    ? 'clorio-signed-fields'
    : isNullifier
    ? 'clorio-created-nullifier'
    : isJsonMessageToSign
    ? 'clorio-signed-json-message'
    : 'clorio-signed-message';

  const onClose = () => {
    setZkappState(state => ({
      ...state,
      showMessageSign: false,
      isJsonMessageToSign: false,
      isNullifier: false,
      isFields: false,
      messageToSign: '',
    }));
  };

  useEffect(() => {
    if (fromRef.current) {
      setFromTextWidth(fromRef.current.offsetWidth);
    }
  }, [fromRef.current]);

  const onConfirm = async (mnemonic: string) => {
    if (!mnemonic) return;

    let privateKey = mnemonic;
    if (mnemonic.trim().split(' ').length > 2) {
      privateKey = (await mnemonicToPrivateKey(mnemonic, wallet.accountNumber)) || mnemonic;
    }

    let signedMessage;
    if (isFields || isNullifier) {
      const nextFields = messageToSign.map(BigInt);
      if (isFields) {
        signedMessage = await (await client()).signFields(nextFields, privateKey);
      } else {
        signedMessage = await (await client()).createNullifier(nextFields, privateKey);
      }
    } else {
      signedMessage = (await client()).signMessage(messageToSign, privateKey);
    }

    if (signedMessage) {
      toast.success('Message signed successfully');
      sendResponse(responseChannel, signedMessage);
      setZkappState(prev => ({
        ...prev,
        messageToSign: '',
        showMessageSign: false,
        isJsonMessageToSign: false,
        isNullifier: false,
        isFields: false,
      }));
      setShowPassword(false);
    } else {
      toast.error('Error signing message');
    }
  };

  return (
    <ModalContainer
      show={showMessageSign}
      close={onClose}
      className="confirm-transaction-modal"
    >
      <div>
        <h1>Sign message</h1>
        <hr />
      </div>

      {showPassword ? (
        <PasswordDecrypt
          onClose={() => setShowPassword(false)}
          onSuccess={onConfirm}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 confirm-transaction-data">
            <div
              ref={fromRef}
              className="w-100"
            >
              <h4>From</h4>
              <Truncate
                text={address}
                width={fromTextWidth || 450}
              />
            </div>
          </div>
          <div className="flex justify-start w-100">
            <div className="w-100">
              <h4>Message</h4>
              <pre className="w-100 overflow-x-auto text-start message-box">
                {JSON.stringify(messageToSign, null, 2)}
              </pre>
            </div>
          </div>
          <div className="flex mt-2 gap-4 confirm-transaction-data sm-flex-reverse">
            <Button
              className="w-100"
              text="Cancel"
              style="standard"
              variant="outlined"
              onClick={onClose}
            />
            <Button
              className="w-100"
              text="Sign"
              style="primary"
              onClick={() => setShowPassword(true)}
            />
          </div>
        </div>
      )}
    </ModalContainer>
  );
}
