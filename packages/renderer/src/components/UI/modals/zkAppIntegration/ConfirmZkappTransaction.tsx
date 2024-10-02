import {useRecoilState, useRecoilValue} from 'recoil';
import {ModalContainer} from '..';
import {walletState, zkappState} from '../../../../store';
import {useCallback, useEffect, useRef, useState} from 'react';
import Button from '../../Button';
import {getAccountAddress, sendResponse} from '../../../../tools/mina-zkapp-bridge';
import {useLazyQuery} from '@apollo/client';
import {INonceQueryResult} from '../../../../pages/sendTX/SendTXHelper';
import {GET_NONCE} from '../../../../graphql/query';
import PasswordDecrypt from '../../../PasswordDecrypt';
import {toast} from 'react-toastify';
import {client, toMINA, toNanoMINA} from '/@/tools';
import {mnemonicToPrivateKey} from '../../../../../../preload/src/bip';
import {ERROR_CODES} from '/@/tools/zkapp';
import TransactionData from './TransactionData';

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

    if (nonceError) {
      console.error('Error in send-payment:', nonceError);
      sendResponse('error', {error: nonceError});
      return;
    }

    let signResult;
    try {
      const signClient = await client();
      let signBody: ZkappCommand = {};
      const sendFee = toNanoMINA(transactionData.feePayer.fee || transactionData.fee);
      signBody = {
        zkappCommand: transactionData.transaction,
        feePayer: {
          feePayer: transactionData.from,
          fee: transactionData.feePayer.fee || sendFee,
          nonce: `${transactionData?.nonce || nonceData?.accountByKey?.usableNonce || 0}`,
          memo: transactionData.feePayer.memo || '',
        },
      };
      signResult = await signClient.signTransaction(signBody, privateKey);
      sendResponse('clorio-signed-tx', {signedData: JSON.stringify(signResult.data)});
      toast.success('Transaction signed successfully');
    } catch (error) {
      console.error('Error in signTransaction:', error);
      sendResponse('error', {error});
      return;
    }

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

  const onFeeEdit = (fee: number) => {
    setZkappState(state => ({
      ...state,
      transactionData: {
        ...state.transactionData,
        fee,
        feePayer: {
          ...state.transactionData.feePayer,
          fee: toNanoMINA(fee),
        },
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

  const formatData = useCallback(
    data => {
      if (!data) return {};
      const {feePayer, transaction, fee, from} = data;
      return {
        from,
        fee: feePayer?.fee ? toMINA(feePayer?.fee) : fee,
        to: transaction?.accountUpdates?.[0]?.body?.publicKey,
        memo: JSON.stringify(shortTransactionData(), null, 2),
        nonce: nonceData?.accountByKey?.usableNonce,
      };
    },
    [transactionData],
  );

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
        <>
          <TransactionData
            transactionData={formatData(transactionData)}
            onFeeEdit={onFeeEdit}
            onNonceEdit={onNonceEdit}
            isZkappCommand
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
              onClick={() => setShowPassword(true)}
            />
          </div>
        </>
      )}
    </ModalContainer>
  );
}
