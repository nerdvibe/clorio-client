import {useEffect, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {walletState, zkappState} from '/@/store';
import {
  createAndSignLedgerTransaction,
  isMinaAppOpen,
  reEncodeRawSignature,
} from '/@/tools/ledger/ledger';
import {toast} from 'react-toastify';
import {toNanoMINA} from '/@/tools';
import LedgerSignError from './LedgerSignError';
import LedgerSingPending from './LedgerSingPending';
import {checkMemoLength} from '/@/pages/sendTX/SendTXHelper';

interface IConfirmZkappLedger {
  onSuccess: (passphrase: string) => void;
  onClose: () => void;
}
export default function ConfirmZkappLedger({onSuccess, onClose}: IConfirmZkappLedger) {
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
      checkMemoLength(transactionData.memo);
      await isMinaAppOpen();
      const senderAccount = ledgerAccount || 0;
      const signature = await createAndSignLedgerTransaction({
        senderAccount,
        senderAddress: transactionData.from,
        transactionData: {
          senderAddress: transactionData.from,
          receiverAddress: transactionData.to,
          amount: toNanoMINA(transactionData.amount),
          fee: toNanoMINA(transactionData.fee),
          memo: transactionData.memo,
          nonce: +transactionData.nonce || 0,
        },
        nonce: +transactionData.nonce || 0,
      });
      completeSignature(reEncodeRawSignature(signature.signature));
    } catch (e) {
      setShowError(true);
      setErrorMessage(e.message || 'An error occurred while loading hardware wallet');
      toast.error(e.message || 'An error occurred while loading hardware wallet');
    }
  };

  const completeSignature = signature => {
    const data = {
      signature,
      publicKey: transactionData.from,
      data: {
        from: transactionData.from,
        to: transactionData.to,
        amount: toNanoMINA(transactionData.amount),
        fee: toNanoMINA(transactionData.fee),
        memo: transactionData.memo,
        nonce: +transactionData.nonce || 0,
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
              <LedgerSingPending transactionData={transactionData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
