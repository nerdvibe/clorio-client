import {useState, useEffect, useContext, useMemo, useRef} from 'react';
import {useQuery as useRestQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import TransactionForm from '/@/components/forms/transactionForm/TransactionForm';
import {
  ConfirmTransaction,
  CustomNonce,
  ModalContainer,
  BroadcastTransaction,
} from '/@/components/UI/modals';
import {
  createAndSignLedgerTransaction,
  createLedgerPaymentInputFromPayload,
  isMinaAppOpen,
} from '/@/tools/ledger';
import {
  toNanoMINA,
  createPaymentInputFromPayload,
  createSignatureInputFromSignature,
  MINIMUM_NONCE,
  deriveAccount,
  getPassphraseFlag,
  toMINA,
} from '/@/tools';
import Spinner from '/@/components/UI/Spinner';
import {getAccount, toNonceQueryResult} from '/@/api/account';
import {getFees} from '/@/api/content';
import {broadcastPayment} from '/@/api/transactions';
import {useNetworkSettingsContext} from '/@/contexts/NetworkContext';
import {
  checkBalanceAfterTransaction,
  checkMemoLength,
  checkNonce,
  checkTransactionFields,
  initialTransactionData,
  ModalStates,
  SendTXPageSteps,
} from './SendTXHelper';
import type {IFeeQuery, IWalletData, ITransactionData, IKeypair} from '/@/types';
import type {IBalanceContext} from '/@/contexts/balance/BalanceTypes';
import {BalanceContext} from '/@/contexts/balance/BalanceContext';
import TransactionAuthentication from '/@/components/transactionAuthentication/TransactionAuthentication';
import {signTransaction} from '/@/tools/utils';
import {useRecoilValue} from 'recoil';
import {deeplinkState, walletState} from '/@/store';
import {DeeplinkType} from '/@/hooks/useDeeplinkHandler';
import SendTXLayout from './SendTXLayout';

interface IProps {
  sessionData: IWalletData;
}

function SendTX(props: IProps) {
  const navigate = useNavigate();
  const numberOfSteps = Object.values(SendTXPageSteps).filter(val => !isNaN(+val)).length;

  const [privateKey, setPrivateKey] = useState<string>('');
  const [key, setKeypair] = useState({publicKey: '', privateKey: ''});
  const [waitingNonce, setWaitingNonce] = useState<boolean>(false);
  const [sendTransactionFlag, setSendTransactionFlag] = useState<boolean>(false);
  const [step, setStep] = useState<number>(SendTXPageSteps.FORM);
  const [showModal, setShowModal] = useState<string>('');
  const [customNonce, setCustomNonce] = useState<number>(MINIMUM_NONCE);
  const [showLoader] = useState<boolean>(false);
  const [ledgerError, setLedgerError] = useState(false);
  const [transactionData, setTransactionData] = useState<ITransactionData>(initialTransactionData);
  const [ledgerTransactionData, setLedgerTransactionData] = useState<string>('');
  const [storedPassphrase, setStoredPassphrase] = useState('');
  const previousStepRef = useRef(step);

  const {getBalance, setShouldBalanceUpdate} = useContext<Partial<IBalanceContext>>(BalanceContext);
  const wallet = useRecoilValue(walletState);
  const {settings} = useNetworkSettingsContext();
  const senderAddress = wallet.address;
  const balance = getBalance && getBalance(wallet.address);
  const isLedgerEnabled = wallet.ledger;
  const {
    data: accountData,
    refetch: nonceRefetch,
    isLoading: accountLoading,
    isFetching: accountFetching,
    error: nonceError,
  } = useRestQuery({
    queryKey: ['account', settings?.apiUrl, senderAddress],
    queryFn: () => getAccount(settings!.apiUrl, senderAddress),
    enabled: Boolean(settings && senderAddress),
  });
  const nonceData = useMemo(
    () => (accountData ? toNonceQueryResult(accountData) : undefined),
    [accountData],
  );
  const nonceLoading = accountLoading || accountFetching;

  const deeplinkData = useRecoilValue(deeplinkState);

  const feeQuery = useRestQuery<IFeeQuery>({
    queryKey: ['fees', settings?.apiUrl],
    queryFn: () => getFees(settings!.apiUrl),
    enabled: Boolean(settings),
  });

  useEffect(() => {
    const avgFee = feeQuery.data?.estimatedFee?.txFees?.average;
    if (avgFee !== undefined) {
      setTransactionData(prev => ({
        ...prev,
        fee: toNanoMINA(avgFee),
      }));
    }
  }, [feeQuery.data]);

  const queryClient = useQueryClient();
  const broadcastTransaction = useMutation({
    mutationFn: ({input, signature}: {input: unknown; signature: unknown}) => {
      if (!settings) throw new Error('REST API settings are unavailable');
      return broadcastPayment(settings.apiUrl, input, signature);
    },
    retry: false,
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: ['account', settings?.apiUrl, senderAddress]});
      void queryClient.invalidateQueries({queryKey: ['mempool', settings?.apiUrl, senderAddress]});
      void queryClient.invalidateQueries({queryKey: ['transactions', settings?.apiUrl, senderAddress]});
    },
    onError: error => {
      setTimeout(() => {
        toast.error(error instanceof Error ? error.message : 'Transaction broadcast failed');
        clearState();
      }, 1000);
    },
  });
  const broadcastResult = broadcastTransaction;

  useEffect(() => {
    setStoredPassphrase(getPassphraseFlag());
  }, []);

  useEffect(() => {
    if (deeplinkData.type === DeeplinkType.SEND_TX && deeplinkData.data) {
      const {data} = deeplinkData;
      setTransactionData(prev => ({
        ...prev,
        amount: toNanoMINA(data.amount || 0),
        fee: toMINA(data.fee || 0),
        receiverAddress: data.to || '',
        nonce: nonceData?.accountByKey.usableNonce,
        memo: data.memo || '',
      }));
    }
  }, [deeplinkData, nonceData]);

  useEffect(() => {
    if (isLedgerEnabled && !ledgerTransactionData && step === SendTXPageSteps.PRIVATE_KEY) {
      const transactionListener = sendLedgerTransaction();
      return transactionListener.unsubscribe;
    }
    if (isLedgerEnabled && step === SendTXPageSteps.BROADCAST) {
      setTimeout(broadcastLedgerTransaction, 2000);
    }
  }, [ledgerTransactionData, step, isLedgerEnabled]);

  useEffect(() => {
    if (!nonceLoading && nonceError) {
      nonceRefetch();
    }
  }, [nonceLoading, nonceError, nonceRefetch]);

  useEffect(() => {
    if (waitingNonce && !nonceLoading) {
      openConfirmationModal();
      setWaitingNonce(false);
    }
  }, [waitingNonce, nonceLoading]);

  useEffect(() => {
    if (showModal && broadcastResult.isSuccess && sendTransactionFlag) {
      clearState(false);
      setTimeout(() => {
        nonceRefetch();
        if (setShouldBalanceUpdate) {
          setShouldBalanceUpdate(true);
        }
        toast.success('Transaction successfully broadcasted');
        setStep(SendTXPageSteps.FORM);
        navigate('/send-tx');
      }, 3000);
    }
  });

  useEffect(() => {
    return () => {
      setPrivateKey('');
    };
  }, []);

  useEffect(() => {
    previousStepRef.current = step;
  }, [step]);

  const broadcastLedgerTransaction = () => {
    try {
      if (ledgerTransactionData) {
        const {amount, fee} = transactionData;
        const SendPaymentInput = createLedgerPaymentInputFromPayload({
          transactionData,
          fee,
          amount,
          senderAddress,
        });
        const SignatureInput = {rawSignature: ledgerTransactionData};
        broadcastTransaction.mutate({input: SendPaymentInput, signature: SignatureInput});
        setSendTransactionFlag(true);
      }
    } catch {
      toast.error('There was an error broadcasting delegation');
    }
  };

  const openConfirmationModal = async () => {
    if (nonceLoading) {
      setWaitingNonce(true);
      return;
    }
    try {
      if (!nonceData && !customNonce) {
        return setShowModal(ModalStates.NONCE);
      }
      if (getBalance) {
        const {data: refreshedAccount} = await nonceRefetch();
        checkBalanceAfterTransaction({
          balance: refreshedAccount?.balance,
          transactionData,
        });
        checkTransactionFields(transactionData);
        setStep(SendTXPageSteps.PRIVATE_KEY);
        setShowModal('');
      }
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const confirmPrivateKey = async (passphrase?: string) => {
    try {
      if (!privateKey && !passphrase) {
        throw new Error();
      }
      setShowModal('');
      const derivedData = await deriveAccount(
        passphrase?.trim() || privateKey.trim(),
        wallet.accountNumber,
      );
      setTransactionData(prev => ({...prev, senderAddress: derivedData.publicKey || ''}));
      setKeypair(derivedData);
      setStep(SendTXPageSteps.CONFIRMATION);
    } catch {
      toast.error('Please check your Passphrase or Private key');
    }
  };

  const stepBackwards = () => {
    if (step === SendTXPageSteps.CONFIRMATION && storedPassphrase) {
      setStep(prev => prev - 2);
    } else {
      setStep(prev => prev - 1);
    }
    setPrivateKey('');
  };

  const getNonce = () => {
    return nonceData && checkNonce(nonceData) ? nonceData?.accountByKey.usableNonce : customNonce;
  };

  const clearState = (redirect = true) => {
    if (redirect) {
      setStep(SendTXPageSteps.FORM);
    }
    setShowModal('');
    setCustomNonce(MINIMUM_NONCE);
    setTransactionData(initialTransactionData);
    setLedgerTransactionData('');
    setSendTransactionFlag(false);
  };

  const closeNonceModal = () => {
    setShowModal('');
    setCustomNonce(0);
  };

  const sendLedgerTransaction = async () => {
    try {
      checkMemoLength(transactionData);
      await isMinaAppOpen();
      const senderAccount = props.sessionData?.ledgerAccount || 0;
      const actualNonce = getNonce();
      setTransactionData(prev => ({...prev, nonce: actualNonce}));
      const signature = await createAndSignLedgerTransaction({
        senderAccount,
        senderAddress,
        transactionData,
        nonce: actualNonce,
      });
      setLedgerTransactionData(signature.signature);
      setStep(SendTXPageSteps.CONFIRMATION);
    } catch (e) {
      toast.error((e as Error).message || 'An error occurred while loading hardware wallet');
      setLedgerError(true);
    }
  };

  const sendTransaction = async () => {
    setShowModal(ModalStates.BROADCASTING);
    setStep(SendTXPageSteps.BROADCAST);
    if (isLedgerEnabled) {
      return;
    }
    try {
      const actualNonce = getNonce();
      const derivedData = await deriveAccount(
        key.privateKey.trim() || privateKey.trim(),
        wallet.accountNumber,
      );
      setTransactionData(prev => ({...prev, senderAddress: derivedData.publicKey || ''}));
      const keypair = {
        privateKey: derivedData?.privateKey,
        publicKey: derivedData?.publicKey,
      } as IKeypair;
      const signedPayment = await signTransaction(keypair.privateKey, {
        ...transactionData,
        from: derivedData?.publicKey || senderAddress,
        to: transactionData.receiverAddress,
        nonce: actualNonce,
        fee: transactionData.fee,
        amount: transactionData.amount,
      });

      if (signedPayment) {
        const signatureInput = createSignatureInputFromSignature(signedPayment.signature);
        const paymentInput = createPaymentInputFromPayload(signedPayment.data);
        broadcastTransaction.mutate({input: paymentInput, signature: signatureInput});
        setPrivateKey('');
        setSendTransactionFlag(true);
      }
    } catch {
      setShowModal('');
      toast.error('Check if the receiver address and/or the passphrase/private key are right');
      stepBackwards();
      setPrivateKey('');
    }
  };

  const retryLedgerTransaction = () => {
    setLedgerError(false);
    sendLedgerTransaction();
  };

  const stepDirection = step >= previousStepRef.current ? 'forward' : 'backward';

  const renderStepContent = () => {
    switch (step) {
      case SendTXPageSteps.FORM:
        return (
          <TransactionForm
            averageFee={feeQuery?.data?.estimatedFee?.txFees?.average || 0}
            fastFee={feeQuery?.data?.estimatedFee?.txFees?.fast || 0}
            nextStep={openConfirmationModal}
            transactionData={transactionData}
            setData={setTransactionData}
            balance={balance}
          />
        );
      case SendTXPageSteps.PRIVATE_KEY:
        return (
          <TransactionAuthentication
            isLedgerEnabled={isLedgerEnabled}
            setPrivateKey={setPrivateKey}
            stepBackwards={stepBackwards}
            confirmPrivateKey={confirmPrivateKey}
            ledgerError={ledgerError}
            stepBackward={stepBackwards}
            retryLedgerTransaction={retryLedgerTransaction}
            storedPassphrase={!!storedPassphrase}
          />
        );
      case SendTXPageSteps.CONFIRMATION:
        return (
          <ConfirmTransaction
            walletAddress={senderAddress}
            transactionData={transactionData}
            ledgerTransactionData={ledgerTransactionData}
            isLedgerEnabled={isLedgerEnabled}
            stepBackward={stepBackwards}
            sendTransaction={sendTransaction}
          />
        );
      case SendTXPageSteps.BROADCAST:
        return <BroadcastTransaction />;
      default:
        return null;
    }
  };

  return (
    <SendTXLayout step={{total: numberOfSteps, current: step + 1}}>
      <div className="full-width">
        <Spinner
          show={showLoader}
          className="spinner-container center full-width"
        >
          <>
            <div
              key={step}
              className={`sendtx-content sendtx-content--${stepDirection}`}
            >
              {renderStepContent()}
            </div>
            <ModalContainer
              show={showModal === ModalStates.NONCE}
              close={closeNonceModal}
            >
              <CustomNonce
                proceedHandler={openConfirmationModal}
                setCustomNonce={setCustomNonce}
                nonce={customNonce}
              />
            </ModalContainer>
          </>
        </Spinner>
      </div>
    </SendTXLayout>
  );
}

export default SendTX;
