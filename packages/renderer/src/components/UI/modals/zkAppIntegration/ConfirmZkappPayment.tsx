import {useRecoilState, useRecoilValue} from 'recoil';
import {ModalContainer} from '..';
import {walletState, zkappState} from '../../../../store';
import {useEffect, useRef, useState} from 'react';
import Truncate from 'react-truncate-inside/es';
import Button from '../../Button';
import {getAccountAddress, sendResponse} from '../../../../tools/mina-zkapp-bridge';
import {useLazyQuery} from '@apollo/client';
import {INonceQueryResult} from '../../../../pages/sendTX/SendTXHelper';
import {GET_NONCE} from '../../../../graphql/query';
import {signTransaction} from '../../../../tools/utils';
import PasswordDecrypt from '../../../PasswordDecrypt';
import {toast} from 'react-toastify';
import {mnemonicToPrivateKey} from '../../../../../../preload/src/bip';
import {client} from '/@/tools';
import {ERROR_CODES} from '/@/tools/zkapp';

export default function ConfirmZkappPayment() {
  const wallet = useRecoilValue(walletState);
  const fromRef = useRef(null);
  const [fromTextWidth, setFromTextWidth] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [fetchNonce, {data: nonceData, error: nonceError}] =
    useLazyQuery<INonceQueryResult>(GET_NONCE);
  const [{transactionData, showPaymentConfirmation}, setZkappState] = useRecoilState(zkappState);

  useEffect(() => {
    if (showPaymentConfirmation) {
      const address = getAccountAddress();
      fetchNonce({variables: {publicKey: address[0]}});
    }
  }, [showPaymentConfirmation]);

  useEffect(() => {
    if (fromRef.current) {
      setFromTextWidth(fromRef.current.offsetWidth - 350);
    }
  }, [fromRef.current]);

  const onClose = () => {
    setZkappState(state => ({
      ...state,
      showPaymentConfirmation: false,
      showDelegationConfirmation: false,
      showTransactionConfirmation: false,
    }));
    setShowPassword(false);
    sendResponse('clorio-error', ERROR_CODES.userRejectedRequest);
  };

  // TODO: Fix amount and fee
  const onConfirm = async (password: string) => {
    let privateKey = password;
    const address = getAccountAddress();
    if (password.trim().split(' ').length > 2) {
      privateKey = (await mnemonicToPrivateKey(password, wallet.accountNumber)) || password;
    }
    if (nonceError) {
      console.error('Error in send-payment:', nonceError);
      sendResponse('error', {error: nonceError});
      return;
    }
    const nonce = nonceData?.accountByKey?.usableNonce;
    const signedTx = await signTransaction(privateKey, {
      ...transactionData,
      nonce,
      from: address[0],
    });
    const hashedTx = await (await client()).hashPayment(signedTx);
    // TODO: Add tx broadcast
    sendResponse('clorio-signed-payment', {hash: hashedTx});
    toast.success('Transaction signed successfully');
    setZkappState(state => ({
      ...state,
      isPendingConfirmation: true,
      showPaymentConfirmation: false,
      showDelegationConfirmation: false,
      showTransactionConfirmation: false,
      isZkappCommand: false,
      transactionData: {
        from: '',
        to: '',
        amount: '',
        fee: '',
        nonce: '',
        memo: '',
      },
    }));
    setShowPassword(false);
  };

  return (
    <ModalContainer
      show={showPaymentConfirmation}
      close={onClose}
      className="confirm-transaction-modal"
    >
      <div>
        <h1>Confirm transaction</h1>
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
            <div ref={fromRef}>
              <h4>From</h4>
              <Truncate
                text={transactionData.from}
                width={fromTextWidth || 250}
              />
            </div>
            <div>
              <h4>To</h4>
              <Truncate
                text={transactionData.to}
                width={fromTextWidth || 250}
              />
            </div>
          </div>
          <div className="flex justify-start">
            <div className="flex flex-col w-100">
              <div>
                <h4>Amount</h4>
                <p>{transactionData.amount} MINA</p>
              </div>
              <div>
                <h4>Transaction fee</h4>
                <p>{transactionData.fee || 0.0101} MINA</p>
              </div>
            </div>
            {transactionData.memo && (
              <div className="flex flex-col w-100">
                <h4>Memo</h4>
                <p>{transactionData.memo}</p>
              </div>
            )}
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
