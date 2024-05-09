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
import PasswordDecrypt from '../../../PasswordDecrypt';
import {toast} from 'react-toastify';
import {client} from '/@/tools';
import {mnemonicToPrivateKey} from '../../../../../../preload/src/bip';
import {ERROR_CODES} from '/@/tools/zkapp';

export default function ConfirmZkappTransaction() {
  const wallet = useRecoilValue(walletState);
  const fromRef = useRef(null);
  const [fromTextWidth, setFromTextWidth] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [fetchNonce, {data: nonceData, error: nonceError}] =
    useLazyQuery<INonceQueryResult>(GET_NONCE);
  const [{transactionData, showTransactionConfirmation, isZkappCommand}, setZkappState] =
    useRecoilState(zkappState);

  useEffect(() => {
    if (showTransactionConfirmation) {
      const address = getAccountAddress();
      fetchNonce({variables: {publicKey: address[0]}});
    }
  }, [showTransactionConfirmation]);

  useEffect(() => {
    if (fromRef.current) {
      setFromTextWidth(fromRef.current.offsetWidth - 350);
    }
  }, [fromRef.current]);

  const shortTransactionData = () => {
    if (transactionData?.transaction) {
      return {
        feePayer: {
          publicKey: transactionData?.transaction?.feePayer?.body?.publicKey,
          fee: transactionData?.transaction?.feePayer?.body?.publicKey,
        },
        accountUpdates: transactionData?.transaction?.accountUpdates?.map(accountUpdate => {
          return {
            publicKey: accountUpdate.body.publicKey,
            tokenId: accountUpdate.body.tokenId,
            balanceChange: accountUpdate.body.balanceChange.magnitude,
          };
        }),
      };
    }
  };

  const onClose = () => {
    setZkappState(state => ({
      ...state,
      showTransactionConfirmation: false,
      showDelegationConfirmation: false,
    }));
    setShowPassword(false);
    sendResponse('clorio-error', ERROR_CODES.userRejectedRequest);
  };

  const onConfirm = async (mnemonic: string) => {
    let privateKey = mnemonic;
    if (mnemonic.trim().split(' ').length > 2) {
      privateKey = (await mnemonicToPrivateKey(mnemonic, wallet.accountNumber)) || mnemonic;
    }

    // const address = getAccountAddress();
    // await fetchNonce({variables: {publicKey: address[0]}});
    if (nonceError) {
      console.error('Error in send-payment:', nonceError);
      sendResponse('error', {error: nonceError});
      return;
    }
    // const nonce = nonceData?.accountByKey?.usableNonce;
    const feePayer = {
      ...transactionData?.transaction?.feePayer?.body,
      publicKey: undefined,
      feePayer: transactionData?.from,
      fee: 1,
    };
    const payload = {zkappCommand: transactionData?.transaction, feePayer};
    await (await client()).signZkappCommand(payload, privateKey);
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
      show={showTransactionConfirmation}
      close={onClose}
      closeOnBackgroundClick={false}
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
            {transactionData?.from && (
              <div ref={fromRef}>
                <h4>From</h4>
                <Truncate
                  text={transactionData?.from || ''}
                  width={fromTextWidth || 250}
                />
              </div>
            )}
            {transactionData?.to && (
              <div>
                <h4>To</h4>
                <Truncate
                  text={transactionData?.to || ''}
                  width={fromTextWidth || 250}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-start">
            <div className="flex w-100">
              <div className="w-100">
                <h4>Amount</h4>
                <p className='data-field'>{transactionData.amount} MINA</p>
              </div>
              <div className="w-100">
                <h4>Transaction fee</h4>
                <p className='data-field'>{transactionData.fee || 0.0101} MINA</p>
              </div>
            </div>
            {isZkappCommand && (
              <div className="flex flex-col w-100">
                <h4>Content</h4>
                <pre className="w-100 overflow-x-auto text-start message-box">
                  {JSON.stringify(shortTransactionData(), null, 2)}
                </pre>
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
