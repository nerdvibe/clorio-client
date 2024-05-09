import {useRecoilState, useRecoilValue} from 'recoil';
import {ModalContainer} from '..';
import {configState, walletState, zkappState} from '../../../../store';
import {zkappInitialState} from '../../../../store/zkapp';
import {useContext, useEffect, useState} from 'react';
import Button from '../../Button';
import {getAccountAddress, sendResponse} from '../../../../tools/mina-zkapp-bridge';
import {useLazyQuery, useMutation} from '@apollo/client';
import {INonceQueryResult} from '../../../../pages/sendTX/SendTXHelper';
import {BROADCAST_TRANSACTION, GET_NONCE} from '../../../../graphql/query';
import {signTransaction} from '../../../../tools/utils';
import PasswordDecrypt from '../../../PasswordDecrypt';
import {toast} from 'react-toastify';
import {mnemonicToPrivateKey} from '../../../../../../preload/src/bip';
import {client, createPaymentInputFromPayload, createSignatureInputFromSignature} from '/@/tools';
import {ERROR_CODES} from '/@/tools/zkapp';
import ConfirmZkappLedger from './ConfirmZkappLedger';
import TransactionData from './TransactionData';
import {IBalanceContext} from '/@/contexts/balance/BalanceTypes';
import {BalanceContext} from '/@/contexts/balance/BalanceContext';
import * as Big from 'big.js';

export default function ConfirmZkappPayment() {
  const wallet = useRecoilValue(walletState);
  const {isLedgerEnabled} = useRecoilValue(configState);
  const [showPassword, setShowPassword] = useState(false);
  const [fetchNonce, {data: nonceData, error: nonceError}] =
    useLazyQuery<INonceQueryResult>(GET_NONCE);
  const [{transactionData, showPaymentConfirmation}, setZkappState] = useRecoilState(zkappState);
  const {getBalance} = useContext<Partial<IBalanceContext>>(BalanceContext);

  const [broadcastTransaction] = useMutation(BROADCAST_TRANSACTION, {
    onError: error => {
      setTimeout(() => {
        toast.error(error.message);
        onClose();
      }, 1000);
    },
  });

  useEffect(() => {
    if (showPaymentConfirmation) {
      const address = getAccountAddress();
      fetchNonce({variables: {publicKey: address[0]}});
    }
  }, [showPaymentConfirmation]);

  const onClose = () => {
    setZkappState(zkappInitialState);
    setShowPassword(false);
    sendResponse('clorio-error', ERROR_CODES.userRejectedRequest);
  };

  // Check with BigJs if the balance is enough
  const checkBalance = (fee: number | string) => {
    if (getBalance) {
      const address = getAccountAddress();
      const balance = getBalance(address[0]);
      const available = +(balance?.liquidUnconfirmed || 0);
      if (+available > 0 && +Big(+available).sub(fee) >= 0) {
        return true;
      }
    }
    return false;
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
    completePayment(signedTx);
  };

  const completePayment = async (signedTx: unknown) => {
    const hashedTx = await (await client()).hashPayment(signedTx);
    sendResponse('clorio-signed-payment', {hash: hashedTx});
    toast.success('Transaction signed successfully, waiting for broadcast.');
    setZkappState(state => ({
      ...state,
      ...zkappInitialState,
      isPendingConfirmation: true,
    }));
    setShowPassword(false);
    broadcastPayment(signedTx);
  };

  const broadcastPayment = async (signedTx: unknown) => {
    const signatureInput = createSignatureInputFromSignature(signedTx.signature);
    const paymentInput = createPaymentInputFromPayload(signedTx.data);
    await broadcastTransaction({
      variables: {input: paymentInput, signature: signatureInput},
    });
  };

  const onSign = async () => {
    // Define the required balance
    const {fee} = transactionData;
    // Check if the current balance is sufficient
    if (checkBalance(fee)) {
      // If the balance is sufficient, change the state
      setShowPassword(true);
    } else {
      // If the balance is not sufficient, show an error message or handle it as per your requirement
      toast.error('Insufficient balance');
      console.error('Insufficient balance');
    }
  };

  const onFeeEdit = (fee: number) => {
    setZkappState(state => ({
      ...state,
      transactionData: {
        ...state.transactionData,
        fee,
      },
    }));
  };

  const onNonceEdit = (nonce: number) => {
    setZkappState(state => ({
      ...state,
      transactionData: {
        ...state.transactionData,
        nonce,
      },
    }));
  };

  const modalTitle = showPassword
    ? isLedgerEnabled
      ? 'Signing transaction'
      : 'Enter your password'
    : 'Confirm transaction';

  return (
    <ModalContainer
      show={showPaymentConfirmation}
      close={onClose}
      className="confirm-transaction-modal"
      closeOnBackgroundClick={false}
    >
      <div>
        <h1>{modalTitle}</h1>
        <hr />
      </div>
      {showPassword ? (
        isLedgerEnabled ? (
          <ConfirmZkappLedger
            onClose={() => setShowPassword(false)}
            onSuccess={completePayment}
          />
        ) : (
          <PasswordDecrypt
            onClose={() => setShowPassword(false)}
            onSuccess={onConfirm}
          />
        )
      ) : (
        <div className="flex flex-col gap-4">
          <TransactionData
            transactionData={transactionData}
            onFeeEdit={onFeeEdit}
            onNonceEdit={onNonceEdit}
          />
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
              onClick={onSign}
            />
          </div>
        </div>
      )}
    </ModalContainer>
  );
}
