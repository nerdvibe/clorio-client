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
  const [{messageToSign, showMessageSign}, setZkappState] = useRecoilState(zkappState);

  const {wallet} = useWallet();
  const {address} = wallet;

  const onClose = () => {
    setZkappState(state => ({
      ...state,
      showMessageSign: false,
      messageToSign: '',
    }));
  };

  useEffect(() => {
    if (fromRef.current) {
      setFromTextWidth(fromRef.current.offsetWidth + 200);
    }
  }, [fromRef.current]);

  const onConfirm = async (mnemonic: string) => {
    if (mnemonic) {
      let privateKey = mnemonic;
      if (mnemonic.trim().split(' ').length > 2) {
        privateKey = (await mnemonicToPrivateKey(mnemonic, wallet.accountNumber)) || mnemonic;
      }
      const signedMessage = (await client()).signMessage(messageToSign, privateKey);
      if (signedMessage) {
        toast.success('Message signed successfully');
        sendResponse('clorio-signed-message', signedMessage);
        setZkappState(prev => ({
          ...prev,
          messageToSign: '',
          showMessageSign: false,
        }));
        setShowPassword(false);
      } else {
        toast.error('Error signing message');
      }
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
            <div>
              <h4>Message</h4>
              <p>{messageToSign}</p>
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
              text="Confirm"
              style="primary"
              onClick={() => setShowPassword(true)}
            />
          </div>
        </div>
      )}
    </ModalContainer>
  );
}
