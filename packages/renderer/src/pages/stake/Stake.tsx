import {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useQuery, useMutation} from '@apollo/client';
import NewsBanner from '../../components/UI/NewsBanner';
import Hoc from '../../components/UI/Hoc';
import type {IValidatorData} from '/@/components/stake/stakeTableRow/ValidatorDataTypes';
import StakeTable from '../../components/stake/stakeTable/StakeTable';
import {
  ModalContainer,
  PrivateKeyModal,
  ConfirmDelegation,
  ConfirmCustomDelegation,
  DelegationFee,
  CustomNonce,
} from '../../components/UI/modals';
import {
  createLedgerDelegationTransaction,
  isMinaAppOpen,
  signTransaction,
} from '/@/tools/ledger/ledger';
import {
  getDefaultValidUntilField,
  DEFAULT_QUERY_REFRESH_INTERVAL,
  VALIDATORS_TABLE_ITEMS_PER_PAGE,
  MINIMUM_NONCE,
  createDelegationPaymentInputFromPayload,
  createSignatureInputFromSignature,
  feeOrDefault,
  deriveAccount,
  getPassphrase,
  client,
} from '/@/tools';
import {
  BROADCAST_DELEGATION,
  GET_VALIDATORS,
  GET_AVERAGE_FEE,
  GET_VALIDATORS_NEWS,
  GET_NONCE_AND_DELEGATE,
} from '/@/graphql/query';
import {LedgerContext} from '/@/contexts/ledger/LedgerContext';
import {BalanceContext} from '/@/contexts/balance/BalanceContext';
import {checkBalance, initialDelegateData, ModalStates} from './StakeHelper';
import {IBalanceContext} from '/@/contexts/balance/BalanceTypes';
import {ILedgerContext} from '/@/contexts/ledger/LedgerTypes';
import {IWalletData} from '/@/types/WalletData';
import {IValidatorsNewsQuery} from '/@/types/NewsData';
import {IFeeQuery} from '/@/types/Fee';
import {INonceDelegateQueryResult} from './StakeTypes';
import {IKeypair} from '/@/types';
import WaitingLedger from '/@/components/UI/modals/WaitingLedger';
import {useRecoilValue} from 'recoil';
import {walletState} from '/@/store';

interface IProps {
  sessionData: IWalletData;
}

const Stake = ({sessionData}: IProps) => {
  const [storedPassphrase, setStoredPassphrase] = useState<boolean>(false);
  const navigate = useNavigate();
  const [delegateData, setDelegate] = useState<IValidatorData>(initialDelegateData);
  const [currentDelegate, setCurrentDelegate] = useState<string>('');
  const [currentDelegateName, setCurrentDelegateName] = useState<string>('');
  const [showModal, setShowModal] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [customDelegate, setCustomDelegate] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [customNonce, setCustomNonce] = useState<number>(MINIMUM_NONCE);
  const [selectedFee, setSelectedFee] = useState<number>(0);
  const [ledgerTransactionData, setLedgerTransactionData] = useState<string>('');
  const [sendTransactionFlag, setSendTransactionFlag] = useState<boolean>(false);
  // const {isLedgerEnabled} = useContext<Partial<ILedgerContext>>(LedgerContext);
  const {getBalance, setShouldBalanceUpdate} = useContext<Partial<IBalanceContext>>(BalanceContext);
  const {address, accountNumber,ledger:isLedgerEnabled} = useRecoilValue(walletState);

  const balance = getBalance && getBalance(address);
  const {
    data: validatorsData,
    error: validatorsError,
    loading: validatorsLoading,
  } = useQuery(GET_VALIDATORS, {variables: {offset}});
  const {data: feeData} = useQuery<IFeeQuery>(GET_AVERAGE_FEE);
  const {data: newsData} = useQuery<IValidatorsNewsQuery>(GET_VALIDATORS_NEWS);
  const {
    data: nonceAndDelegateData,
    refetch: nonceAndDelegateRefetch,
    loading: nonceAndDelegateLoading,
    error: nonceAndDelegateError,
  } = useQuery<INonceDelegateQueryResult>(GET_NONCE_AND_DELEGATE, {
    variables: {publicKey: address},
    fetchPolicy: 'network-only',
    pollInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
  });
  const latestNews =
    newsData && newsData?.newsValidators.length > 0 ? newsData?.newsValidators[0] : {};
  const [broadcastDelegation, broadcastResult] = useMutation(BROADCAST_DELEGATION, {
    onError: error => {
      toast.error(error.message);
      return clearState();
    },
  });

  useEffect(() => {
    getPassphrase().then(passphrase => {
      setStoredPassphrase(passphrase);
    });
  }, []);

  /**
   * If current delegate data arrived from the back-end, set it into the component state
   */
  useEffect(() => {
    if (nonceAndDelegateData?.accountByKey?.delegate?.publicKey) {
      setCurrentDelegate(nonceAndDelegateData?.accountByKey.delegate.publicKey);
      setCurrentDelegateName(nonceAndDelegateData.accountByKey.delegate.name);
    }
  }, [nonceAndDelegateData]);

  /**
   * If there was a problem fetching the nonce, retry to fetch it
   */
  useEffect(() => {
    if (!nonceAndDelegateLoading && nonceAndDelegateError) {
      nonceAndDelegateRefetch();
    }
  }, [nonceAndDelegateLoading, nonceAndDelegateError]);

  /**
   * Wait for the ledger to sign the transaction
   */
  useEffect(() => {
    if (isLedgerEnabled && !ledgerTransactionData) {
      if (showModal === ModalStates.PASSPHRASE) {
        const transactionListener = signLedgerDelegation();
        // @ts-ignore
        return transactionListener.unsubscribe;
      }
    }
  }, [ledgerTransactionData, showModal]);

  /**
   * If a transaction has been broadcasted, show a success alert and clear the component state
   */
  useEffect(() => {
    if (sendTransactionFlag && broadcastResult?.data) {
      clearState();
      if (setShouldBalanceUpdate) {
        setShouldBalanceUpdate(true);
      }
      nonceAndDelegateRefetch({publicKey: sessionData.address});
      toast.success('Delegation successfully broadcasted');
      navigate('/stake');
    }
    broadcastLedgerTransaction();
  }, [sendTransactionFlag, broadcastResult]);

  /**
   * Broadcast the transaction if the passphrase is stored in the session
   */
  // useEffect(() => {
  //   if (storedPassphrase && delegateData.publicKey && selectedFee !== feeOrDefault()) {
  //     setShowModal(ModalStates.BROADCASTING);
  //     signDelegation();
  //   }
  // }, [selectedFee]);

  const broadcastLedgerTransaction = () => {
    try {
      if (ledgerTransactionData && !sendTransactionFlag) {
        const actualNonce = getNonce();
        const publicKey = delegateData?.publicKey;
        const SignatureInput = {rawSignature: ledgerTransactionData};
        const SendPaymentInput = {
          nonce: actualNonce.toString(),
          memo: '',
          fee: selectedFee.toString(),
          to: publicKey,
          from: address,
          validUntil: getDefaultValidUntilField(),
        };
        broadcastDelegation({
          variables: {input: SendPaymentInput, signature: SignatureInput},
        });
        setSendTransactionFlag(true);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  /**
   * Set delegate public key on component state, open confirmation modal
   * @param {string} delegate Delegate public key
   */
  const openModal = (delegate: IValidatorData) => {
    setDelegate(delegate);
    setShowModal(ModalStates.CONFIRM_DELEGATION);
  };

  /**
   * Open modal for the custom delegate insertion
   */
  const openCustomDelegateModal = () => {
    setShowModal(ModalStates.CUSTOM_DELEGATION);
  };

  /**
   * Close every modal and clear component custom nonce and custom delegate
   */
  const closeModal = () => {
    setShowModal('');
    setCustomNonce(MINIMUM_NONCE);
    setCustomDelegate('');
  };

  /**
   * If nonce is not available from the back-end and no custom nonce has already been asked, ask user for a custom nonce.
   * Otherwise proceeds to private key insertion modal
   */
  const confirmDelegate = () => {
    try {
      if (!nonceAndDelegateData && !customNonce) {
        setShowModal(ModalStates.NONCE);
      } else if (customDelegate) {
        setShowModal(ModalStates.FEE);
        setDelegate({publicKey: customDelegate});
      } else {
        setShowModal(ModalStates.FEE);
      }
    } catch (e) {
      setShowModal(ModalStates.FEE);
    }
  };

  /**
   * User confirmed delegate public key, proceed to the fee insertion
   * @param {string} delegate Delegate public key
   */
  const confirmCustomDelegate = (delegate: string) => {
    try {
      nonceAndDelegateRefetch({publicKey: sessionData.address});
      setShowModal(ModalStates.FEE);
      setDelegate({publicKey: delegate});
    } catch (e) {
      setShowModal(ModalStates.FEE);
    }
  };

  /**
   * Close all modals, clears custom nonce state
   */
  const closeNonceModal = () => {
    setShowModal('');
    setCustomNonce(MINIMUM_NONCE);
  };

  /**
   * Clear component state
   */
  const clearState = () => {
    setShowModal('');
    setDelegate(initialDelegateData);
    setSendTransactionFlag(false);
    setCustomNonce(MINIMUM_NONCE);
    setPrivateKey('');
    setCustomDelegate('');
    setLedgerTransactionData('');
    setSelectedFee(feeOrDefault());
  };

  /**
   * Set the query offset based on selected page
   * @param {number} page Page number
   */
  const changeOffset = (page: number) => {
    const data = (page - 1) * VALIDATORS_TABLE_ITEMS_PER_PAGE;
    setOffset(data);
  };

  /**
   * Set the selected fee inside the component state and show the passphrase/private key modal
   * @param selectedFee number
   */
  const setFee = (selectedFee: number) => {
    setSelectedFee(selectedFee);

    // if (!storedPassphrase) {
    setShowModal(ModalStates.PASSPHRASE);
    // }
  };

  /**
   * Sign delegation through the ledger and store the result inside the component state
   */
  const signLedgerDelegation = async () => {
    try {
      if (!delegateData?.publicKey) {
        throw new Error('Recipient Public key is not defined');
      }
      checkBalance(selectedFee, balance);
      // Check if the mina app is open
      await isMinaAppOpen();
      const actualNonce = getNonce();
      const senderAccount = sessionData?.ledgerAccount || 0;
      const receiverAddress = delegateData?.publicKey;
      const transactionToSend = createLedgerDelegationTransaction({
        senderAccount,
        senderAddress: address,
        receiverAddress,
        fee: +selectedFee,
        nonce: actualNonce,
      });
      const signature = await signTransaction(transactionToSend);
      setShowModal(ModalStates.BROADCASTING);
      setLedgerTransactionData(signature.signature);
    } catch (e) {
      toast.error(e.message || 'An error occurred while loading hardware wallet');
      setShowModal('');
    }
  };

  /**
   * Sign stake delegation using MinaSDK through passphrase or private key
   */
  const signDelegation = async (passphrase?: string) => {
    try {
      if (!delegateData?.publicKey) {
        throw new Error('The Public key of the selected delegate is missing');
      }
      checkBalance(selectedFee, balance);
      const actualNonce = getNonce();
      const derivedAccount = await deriveAccount(passphrase?.trim() || privateKey.trim(), accountNumber);
      const keypair = {
        privateKey: derivedAccount.privateKey,
        publicKey: derivedAccount.publicKey,
      } as IKeypair;
      const stakeDelegation = {
        to: delegateData.publicKey,
        from: address || keypair.publicKey,
        fee: selectedFee,
        nonce: actualNonce,
      };
      const signedTransaction = (await client()).signStakeDelegation(
        stakeDelegation,
        keypair.privateKey,
      );
      const verify = (await client()).verifyStakeDelegation(signedTransaction);
      if (signedTransaction) {
        const signatureInput = createSignatureInputFromSignature(signedTransaction.signature);
        const sendPaymentInput = createDelegationPaymentInputFromPayload(signedTransaction.data);
        broadcastDelegation({
          variables: {
            input: sendPaymentInput,
            signature: signatureInput,
          },
        });
        toast.info('Broadcasting delegation');
        setSendTransactionFlag(true);
        setShowModal('');
        setPrivateKey('');
      }
    } catch (e) {
      setPrivateKey('');
      toast.error(
        e.message || 'There was an error processing your delegation, please try again later.',
      );
    }
  };

  /**
   * If nonce is available from the query, return it, otherwise  the custom nonce is returned
   * @returns number Nonce
   */
  const getNonce = () => {
    if (nonceAndDelegateData?.accountByKey?.usableNonce) {
      return nonceAndDelegateData.accountByKey.usableNonce;
    }
    if (nonceAndDelegateData?.accountByKey?.usableNonce === 0) {
      return 0;
    }
    return customNonce;
  };

  return (
    <Hoc>
      <div className="animate__animated animate__fadeIn">
        <NewsBanner {...latestNews} />
        <StakeTable
          address={address}
          toggleModal={openModal}
          validators={validatorsData?.validators}
          loading={validatorsLoading}
          error={validatorsError}
          currentDelegate={currentDelegate}
          currentDelegateName={currentDelegateName}
          openCustomDelegateModal={openCustomDelegateModal}
          setOffset={changeOffset}
          page={offset / VALIDATORS_TABLE_ITEMS_PER_PAGE + 1}
          delegateLoading={nonceAndDelegateLoading}
        />
      </div>
      <ModalContainer
        show={showModal === ModalStates.CONFIRM_DELEGATION}
        close={closeModal}
      >
        <ConfirmDelegation
          name={delegateData?.name}
          closeModal={closeModal}
          confirmDelegate={confirmDelegate}
          loadingNonce={nonceAndDelegateLoading}
        />
      </ModalContainer>
      <ModalContainer
        show={showModal === ModalStates.NONCE}
        close={closeNonceModal}
      >
        <CustomNonce
          proceedHandler={confirmDelegate}
          setCustomNonce={setCustomNonce}
          nonce={customNonce}
        />
      </ModalContainer>
      <ModalContainer
        show={showModal === ModalStates.PASSPHRASE}
        close={closeModal}
      >
        {isLedgerEnabled ? (
          <WaitingLedger closeModal={closeModal} />
        ) : (
          <PrivateKeyModal
            confirmPrivateKey={signDelegation}
            closeModal={closeModal}
            setPrivateKey={setPrivateKey}
            subtitle={customDelegate && `You are going to delegate ${customDelegate}`}
            storedPassphrase={storedPassphrase}
          />
        )}
      </ModalContainer>
      <ModalContainer
        show={showModal === ModalStates.CUSTOM_DELEGATION}
        close={closeModal}
      >
        <ConfirmCustomDelegation
          closeModal={closeModal}
          confirmCustomDelegate={confirmCustomDelegate}
        />
      </ModalContainer>
      <ModalContainer
        show={showModal === ModalStates.FEE}
        close={closeModal}
      >
        <DelegationFee
          closeModal={closeModal}
          fees={feeData}
          proceedHandler={setFee}
        />
      </ModalContainer>
    </Hoc>
  );
};

export default Stake;
