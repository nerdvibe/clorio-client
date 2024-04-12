import {useRecoilState, useRecoilValue} from 'recoil';
import {ModalContainer} from '..';
import {walletState, zkappState} from '../../../../store';
import {zkappInitialState} from '../../../../store/zkapp';
import {useContext, useEffect, useRef, useState} from 'react';
import Truncate from 'react-truncate-inside/es';
import Button from '../../Button';
import {getAccountAddress, sendResponse} from '../../../../tools/mina-zkapp-bridge';
import {useLazyQuery, useMutation} from '@apollo/client';
import {INonceAndBalanceQueryResult} from '../../../../pages/sendTX/SendTXHelper';
import {BROADCAST_DELEGATION, GET_NONCE_AND_BALANCE} from '../../../../graphql/query';
import PasswordDecrypt from '../../../PasswordDecrypt';
import {toast} from 'react-toastify';
import {client, toNanoMINA} from '/@/tools';
import {mnemonicToPrivateKey} from '../../../../../../preload/src/bip';
import Big from 'big.js';
import {IBalanceContext} from '/@/contexts/balance/BalanceTypes';
import {BalanceContext} from '/@/contexts/balance/BalanceContext';
import {ERROR_CODES} from '/@/tools/zkapp';

interface SignedTx {
  signature: {
    field: string;
    scalar: string;
  };
  publicKey: string;
  data: {
    to: string;
    from: string;
    fee: string;
    nonce: string;
    memo: string;
    validUntil: string;
  };
}

export default function ConfirmZkappDelegation() {
  const wallet = useRecoilValue(walletState);
  const fromRef = useRef(null);
  const [fromTextWidth, setFromTextWidth] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [fetchNonce, {data: nonceData, error: nonceError}] =
    useLazyQuery<INonceAndBalanceQueryResult>(GET_NONCE_AND_BALANCE);
  const [{transactionData, showDelegationConfirmation}, setZkappState] = useRecoilState(zkappState);
  const {getBalance} = useContext<Partial<IBalanceContext>>(BalanceContext);
  const [broadcastDelegation] = useMutation(BROADCAST_DELEGATION, {
    onError: error => {
      toast.error(error.message);
      return onClose();
    },
  });

  useEffect(() => {
    if (fromRef.current) {
      setFromTextWidth(fromRef.current.offsetWidth - 250);
    }
  }, [fromRef.current, showDelegationConfirmation]);


  const onClose = () => {
    setZkappState(state => ({
      ...state,
      showTransactionConfirmation: false,
      showDelegationConfirmation: false,
    }));
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

  const onSign = async () => {
    const {fee} = transactionData;
    // Check if the current balance is sufficient
    if (checkBalance(fee)) {
      setShowPassword(true);
    } else {
      // If the balance is not sufficient, show an error message or handle it as per your requirement
      toast.error('Insufficient balance');
      console.error('Insufficient balance');
    }
  };

  const onConfirm = async (password: string) => {
    try {
      // Get the account address
      const address = getAccountAddress();
      if (!address) {
        throw new Error('Account address not found');
      }
      // Determine the private key based on the password
      let privateKey = password;
      if (password.trim().split(' ').length > 2) {
        privateKey = (await mnemonicToPrivateKey(password, wallet.accountNumber)) || password;
      }
      // Handle nonce error
      if (nonceError) {
        console.error('Error in send-payment:', nonceError);
        sendResponse('error', {error: nonceError});
        return;
      }
      // TODO: Add custom nonce
      // Get the nonce

      const nonceResponse = await fetchNonce({variables: {publicKey: address[0]}});
      const nonce = nonceResponse?.data?.accountByKey?.usableNonce;
      if (!nonce && nonce !== 0) {
        throw new Error('Nonce not found');
      }
      // Prepare the stake data
      const stakeData = {
        ...transactionData,
        nonce,
        from: address[0],
        fee: toNanoMINA(transactionData.fee),
      };
      // Sign the stake delegation
      const clientInstance = await client();
      const signedTx = await clientInstance.signStakeDelegation(stakeData, privateKey);
      const hashedTx = await clientInstance.hashStakeDelegation(signedTx);
      await broadcastDelegationTx(signedTx);
      sendResponse('clorio-staked-delegation', {hash: hashedTx});
      onPostSign();
    } catch (error) {
      console.error('Error in onConfirm:', error);
      toast.error('An error occurred while confirming the transaction');
    }
  };

  const broadcastDelegationTx = async (signedTx: SignedTx) => {
    await broadcastDelegation({
      variables: {input: signedTx.data, signature: signedTx.signature},
    });
  };

  const onPostSign = () => {
    setZkappState(state => ({
      ...state,
      ...zkappInitialState,
      isPendingConfirmation: true,
    }));
    setShowPassword(false);
    toast.success('Transaction signed successfully');
  };

  return (
    <ModalContainer
      show={showDelegationConfirmation}
      close={onClose}
      className="confirm-transaction-modal"
    >
      <div>
        <h1>Confirm stake delegation</h1>
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
              onClick={onSign}
            />
          </div>
        </div>
      )}
    </ModalContainer>
  );
}
