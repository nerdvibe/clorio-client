import { useState, useEffect, useContext } from "react";
import TransactionForm from "../../components/forms/transactionForm/TransactionForm";
import {
  ConfirmTransaction,
  ConfirmLedgerTransaction,
  CustomNonce,
  ModalContainer,
  PrivateKeyModal,
  BroadcastTransaction,
} from "../../components/UI/modals";
import Hoc from "../../components/UI/Hoc";
import { useQuery, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import {
  createAndSignLedgerTransaction,
  createLedgerPaymentInputFromPayload,
  isMinaAppOpen,
} from "../../tools/ledger";
import {
  toNanoMINA,
  createPaymentInputFromPayload,
  createSignatureInputFromSignature,
  signTransaction,
  MINIMUM_NONCE,
  readSession,
} from "../../tools";
import Spinner from "../../components/UI/Spinner";
import { derivePublicKey } from "@o1labs/client-sdk";
import { BROADCAST_TRANSACTION, GET_FEE, GET_NONCE } from "../../graphql/query";
import { toast } from "react-toastify";
import {
  checkBalanceAfterTransaction,
  checkMemoLength,
  checkNonce,
  checkTransactionFields,
  initialTransactionData,
  INonceQueryResult,
  ModalStates,
  SendTXPageSteps,
} from "./SendTXHelper";
import { IFeeQuery, IWalletData, ITransactionData } from "../../types";
import { ILedgerContext } from "../../contexts/ledger/LedgerTypes";
import { LedgerContext } from "../../contexts/ledger/LedgerContext";
import { IBalanceContext } from "../../contexts/balance/BalanceTypes";
import { BalanceContext } from "../../contexts/balance/BalanceContext";

interface IProps {
  sessionData: IWalletData;
}

const SendTX = (props: IProps) => {
  const history = useHistory();
  const [privateKey, setPrivateKey] = useState<string>("");
  const [sendTransactionFlag, setSendTransactionFlag] = useState<boolean>(
    false,
  );
  const [step, setStep] = useState<number>(SendTXPageSteps.FORM);
  const [showModal, setShowModal] = useState<string>("");
  const [senderAddress, setSenderAddress] = useState<string>("");
  const [customNonce, setCustomNonce] = useState<number>(MINIMUM_NONCE);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [transactionData, setTransactionData] = useState<ITransactionData>(
    initialTransactionData,
  );
  const [ledgerTransactionData, setLedgerTransactionData] = useState<string>(
    "",
  );
  const { isLedgerEnabled } = useContext<Partial<ILedgerContext>>(
    LedgerContext,
  );
  const { balance, setShouldBalanceUpdate } = useContext<
    Partial<IBalanceContext>
  >(BalanceContext);
  const {
    data: nonceData,
    refetch: nonceRefetch,
  } = useQuery<INonceQueryResult>(GET_NONCE, {
    variables: { publicKey: senderAddress },
    skip: !senderAddress,
    fetchPolicy: "network-only",
  });
  const feeQuery = useQuery<IFeeQuery>(GET_FEE, {
    onCompleted: data => {
      if (data?.estimatedFee?.txFees?.average) {
        setTransactionData({
          ...transactionData,
          fee: toNanoMINA(data.estimatedFee.txFees.average),
        });
      }
      setShowLoader(false);
    },
    onError: () => {
      setShowLoader(false);
    },
  });
  const [broadcastTransaction, broadcastResult] = useMutation(
    BROADCAST_TRANSACTION,
    {
      onError: error => {
        toast.error(error.message);
        clearState();
      },
    },
  );

  /**
   * Listen for ledger action
   */
  useEffect(() => {
    if (isLedgerEnabled && !ledgerTransactionData) {
      if (step === SendTXPageSteps.CONFIRMATION) {
        const transactionListener = sendLedgerTransaction();
        // To be checked with ledger tests
        // @ts-ignore
        return transactionListener.unsubscribe;
      }
    }
    broadcastLedgerTransaction();
  }, [ledgerTransactionData, step]);

  /**
   * If address is not stored inside component state, fetch it and save it.
   * If the transaction has been broadcasted successfully return to initial page state
   */
  useEffect(() => {
    getAndSetAddress();
    if (showModal && broadcastResult?.data && sendTransactionFlag) {
      clearState();
      nonceRefetch({ publicKey: senderAddress });
      if (setShouldBalanceUpdate) {
        setShouldBalanceUpdate(true);
      }
      toast.success("Transaction successfully broadcasted");
      history.replace("/send-tx");
    }
  });

  /**
   * Clean component state on dismount
   */
  useEffect(() => {
    return () => {
      setPrivateKey("");
    };
  }, []);

  /**
   * Ledger data arrived, broadcast the transaction
   */
  const broadcastLedgerTransaction = () => {
    try {
      if (ledgerTransactionData) {
        const { amount, fee } = transactionData;
        const SendPaymentInput = createLedgerPaymentInputFromPayload({
          transactionData,
          fee,
          amount,
          senderAddress,
        });
        const SignatureInput = { rawSignature: ledgerTransactionData };
        broadcastTransaction({
          variables: { input: SendPaymentInput, signature: SignatureInput },
        });
        setSendTransactionFlag(true);
      }
    } catch (e) {
      toast.error("There was an error broadcasting delegation");
    }
  };

  /**
   * Check if nonce is available, if not ask the user for a custom nonce.
   * After the nonce is set, proceed with transaction data verification and private key verification
   */
  const openConfirmationModal = () => {
    try {
      if (!nonceData && !customNonce) {
        return setShowModal(ModalStates.NONCE);
      }
      checkBalanceAfterTransaction({ balance, transactionData });
      checkTransactionFields(transactionData);
      if (isLedgerEnabled) {
        setStep(SendTXPageSteps.CONFIRMATION);
      } else {
        setShowModal(ModalStates.PASSPHRASE);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const closeModal = () => {
    setShowModal("");
    setCustomNonce(0);
    setPrivateKey("");
  };

  /**
   *  Check if private key is not empty
   */
  const confirmPrivateKey = () => {
    if (!privateKey) {
      toast.error("Please insert a private key");
    } else {
      setShowModal("");
      setStep(SendTXPageSteps.CONFIRMATION);
    }
  };

  /**
   * Get back to form
   */
  const stepBackwards = () => {
    setStep(SendTXPageSteps.FORM);
    setPrivateKey("");
  };

  /**
   * If nonce is available from the back-end return it, otherwise return the custom nonce
   * @returns number Nonce
   */
  const getNonce = () => {
    return nonceData && checkNonce(nonceData)
      ? nonceData?.accountByKey.usableNonce
      : customNonce;
  };

  /**
   * Get sender public key from the session data and store it inside the component state
   */
  const getAndSetAddress = async () => {
    const wallet = await readSession();
    setSenderAddress(wallet.address);
  };

  /**
   * Clear component state
   */
  const clearState = () => {
    setStep(SendTXPageSteps.FORM);
    setShowModal("");
    setCustomNonce(MINIMUM_NONCE);
    setTransactionData(initialTransactionData);
    setLedgerTransactionData("");
    setSendTransactionFlag(false);
  };

  /**
   * Close nonce modal
   */
  const closeNonceModal = () => {
    setShowModal("");
    setCustomNonce(0);
  };

  /**
   * Sign transaction with Ledger
   */
  const sendLedgerTransaction = async () => {
    try {
      checkMemoLength(transactionData);
      await isMinaAppOpen();
      const senderAccount = props.sessionData?.ledgerAccount || 0;
      const actualNonce = getNonce();
      setTransactionData({ ...transactionData, nonce: actualNonce });
      const signature = await createAndSignLedgerTransaction({
        senderAccount,
        senderAddress,
        transactionData,
        nonce: actualNonce,
      });
      setShowModal(ModalStates.BROADCASTING);
      setLedgerTransactionData(signature.signature);
    } catch (e) {
      toast.error(
        e.message || "An error occurred while loading hardware wallet",
      );
      stepBackwards();
    }
  };

  /**
   * Broadcast transaction without Ledger
   */
  const sendTransaction = () => {
    setShowModal(ModalStates.BROADCASTING);
    try {
      const actualNonce = getNonce();
      const publicKey = derivePublicKey(privateKey);
      const keypair = { privateKey, publicKey };
      const signedPayment = signTransaction({
        transactionData,
        keypair,
        sender: senderAddress,
        actualNonce,
      });
      if (signedPayment) {
        const signatureInput = createSignatureInputFromSignature(
          signedPayment.signature,
        );
        const paymentInput = createPaymentInputFromPayload(
          signedPayment.payload,
        );
        broadcastTransaction({
          variables: { input: paymentInput, signature: signatureInput },
        });
        setPrivateKey("");
        setSendTransactionFlag(true);
      }
    } catch (e) {
      setShowModal("");
      toast.error(
        "Check if the receiver address and/or the private key are right",
      );
      stepBackwards();
      setPrivateKey("");
    }
  };

  return (
    <Hoc className="main-container">
      <Spinner show={showLoader}>
        <div>
          <div className="animate__animated animate__fadeIn">
            {step === 0 ? (
              <TransactionForm
                averageFee={feeQuery?.data?.estimatedFee?.txFees?.average || 0}
                fastFee={feeQuery?.data?.estimatedFee?.txFees?.fast || 0}
                nextStep={openConfirmationModal}
                transactionData={transactionData}
                setData={setTransactionData}
              />
            ) : isLedgerEnabled ? (
              <ConfirmLedgerTransaction {...transactionData} />
            ) : (
              <ConfirmTransaction
                transactionData={transactionData}
                stepBackward={stepBackwards}
                sendTransaction={sendTransaction}
              />
            )}
          </div>
          <ModalContainer
            show={showModal === ModalStates.PASSPHRASE}
            close={closeModal}>
            <PrivateKeyModal
              confirmPrivateKey={confirmPrivateKey}
              closeModal={closeModal}
              setPrivateKey={setPrivateKey}
            />
          </ModalContainer>
          <ModalContainer
            show={showModal === ModalStates.BROADCASTING}
            close={closeModal}>
            <BroadcastTransaction />
          </ModalContainer>
          <ModalContainer
            show={showModal === ModalStates.NONCE}
            close={closeNonceModal}>
            <CustomNonce
              proceedHandler={openConfirmationModal}
              setCustomNonce={setCustomNonce}
            />
          </ModalContainer>
        </div>
      </Spinner>
    </Hoc>
  );
};

export default SendTX;
