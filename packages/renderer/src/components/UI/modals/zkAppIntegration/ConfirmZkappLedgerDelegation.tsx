import {useEffect, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {walletState, zkappState} from '/@/store';
import {
  createLedgerDelegationTransaction,
  isMinaAppOpen,
  signTransaction,
} from '/@/tools/ledger/ledger';
import {toast} from 'react-toastify';
import {toNanoMINA} from '/@/tools';
import LedgerSignError from './LedgerSignError';
import LedgerSingPending from './LedgerSingPending';

interface IConfirmZkappLedgerDelegation {
  onSuccess: (signedTx: unknown) => void;
  onClose: () => void;
}
export default function ConfirmZkappLedgerDelegation({
  onSuccess,
  onClose,
}: IConfirmZkappLedgerDelegation) {
  const {transactionData} = useRecoilValue(zkappState);
  const {ledgerAccount} = useRecoilValue(walletState);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    sendLedgerTransaction();
  }, []);

  /**
   * Sign transaction with Ledger
   */
  const sendLedgerTransaction = async () => {
    try {
      await isMinaAppOpen();
      const senderAccount = ledgerAccount || 0;
      const transactionToSend = await createLedgerDelegationTransaction({
        senderAddress: transactionData.from,
        receiverAddress: transactionData.to,
        fee: toNanoMINA(transactionData.fee),
        nonce: +transactionData.nonce || 0,
        senderAccount,
      });

      const signature = await signTransaction(transactionToSend);
      completeSignature(signature.signature);
    } catch (e) {
      console.log('🚀 ~ sendLedgerTransaction ~ e:', e);
      setShowError(true);
      setErrorMessage(e.message || 'An error occurred while loading hardware wallet');
      toast.error(e.message || 'An error occurred while loading hardware wallet');
    }
  };

  const completeSignature = signature => {
    const data = {
      signature: {rawSignature: signature},
      publicKey: transactionData.from,
      data: {
        from: transactionData.from,
        to: transactionData.to,
        fee: '' + toNanoMINA(transactionData.fee),
        nonce: '' + transactionData.nonce || 0,
      },
    };
    return onSuccess(data);
  };

  return (
    <div>
      <div className="mx-auto  w-100">
        <div className="align-left mb-2 label text-center w-100">
          <div className="flex w-100 items-center flex-col">
            {showError ? (
              <LedgerSignError message={errorMessage} />
            ) : (
              <LedgerSingPending
                transactionData={transactionData}
                isDelegation
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
