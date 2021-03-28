import React, { useState, useEffect, useContext } from "react";
import TransactionForm from "../components/Transactions/TransactionForm";
import ConfirmTransaction from "../components/Modals/ConfirmTransaction";
import ConfirmLedgerTransaction from "../components/Modals/ConfirmLedgerTransaction";
import Hoc from "../components/General/Hoc";
import { getAddress } from "../tools";
import ModalContainer from "../components/Modals/ModalContainer";
import BroadcastTransaction from "../components/Modals/BroadcastTransaction";
import { useQuery, useMutation } from "@apollo/client";
import PrivateKeyModal from "../components/Modals/PrivateKeyModal";
import { useHistory } from "react-router-dom";
import {
  createAndSignLedgerTransaction,
  createLedgerPaymentInputFromPayload,
  emojiToUnicode,
  escapeUnicode,
  isMinaAppOpen
} from "../tools/ledger";
import {
  createPaymentInputFromPayload,
  createSignatureInputFromSignature,
  signTransaction,
} from "../tools/transactions";
import { toNanoMINA } from "../tools/utils";
import {Big} from "big.js";
import CustomNonce from "../components/Modals/CustomNonce";
import { BalanceContext } from "../context/BalanceContext";
import Spinner from "../components/General/Spinner";
import { derivePublicKey } from "@o1labs/client-sdk";
import { BROADCAST_TRANSACTION, GET_FEE, GET_NONCE } from "../graphql/query";
import { toast } from "react-toastify";
import { LedgerContext } from "../context/LedgerContext";

const initialTransactionData = {
  amount: toNanoMINA(0),
  receiverAddress: "",
  fee: toNanoMINA(0.001),
  nonce: 0,
  memo: "",
};

export default function SendTX(props) {
  const ModalStates = Object.freeze({
    PASSPHRASE: "passphrase",
    BROADCASTING: "broadcasting",
    NONCE: "nonce",
  });
  const [privateKey, setPrivateKey] = useState("");
  const [sendTransactionFlag, setSendTransactionFlag] = useState(false);
  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [customNonce, setCustomNonce] = useState(undefined);
  const [showLoader, setShowLoader] = useState(true);
  const [ledgerTransactionData, setLedgerTransactionData] = useState(undefined);
  const { isLedgerEnabled } = useContext(LedgerContext);
  const { balance, setShouldBalanceUpdate } = useContext(BalanceContext);
  const [transactionData, setTransactionData] = useState(
    initialTransactionData
  );
  const nonceQuery = useQuery(GET_NONCE, {
    variables: { publicKey: senderAddress },
    skip: senderAddress === "",
    fetchPolicy: "network-only",
  });
  const feeQuery = useQuery(GET_FEE, {
    onCompleted: (data) => {
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
      onError: (error) => {
        toast.error(error.message);
        clearState();
      },
    }
  );
  const history = useHistory();

  // If broadcasted successfully return to initial page state
  if (
    showModal &&
    broadcastResult &&
    broadcastResult.data &&
    sendTransactionFlag
  ) {
    clearState();
    nonceQuery.refetch({ publicKey: senderAddress });
    setShouldBalanceUpdate(true);
    toast.success("Transaction successfully broadcasted");
    history.replace("/send-tx");
  }

  // Get sender public key
  getAddress((publicKey) => {
    setSenderAddress(publicKey);
  });

  // Listen for ledger action
  useEffect(() => {
    if (isLedgerEnabled && !ledgerTransactionData) {
      if (step === 1) {
        const transactionListener = sendLedgerTransaction();
        return transactionListener.unsubscribe;
      }
    }
  }, [ledgerTransactionData, step]);

  /**
   * Ledger data arrived, broadcast transaction
   */
  useEffect(() => {
    try {
      if (ledgerTransactionData) {
        const { amount, fee } = transactionData;
        const SendPaymentInput = createLedgerPaymentInputFromPayload(
          transactionData,
          fee,
          amount,
          senderAddress
        );
        const SignatureInput = {
          rawSignature: ledgerTransactionData,
        };
        broadcastTransaction({
          variables: { input: SendPaymentInput, signature: SignatureInput },
        });
        setSendTransactionFlag(true);
      }
    } catch (e) {
      toast.error("There was an error broadcasting delegation");
    }
  }, [ledgerTransactionData]);

  /**
   * Clean component state on dismount
   */
  useEffect(() => {
    return () => {
      setPrivateKey("");
    };
  }, []);

  /**
   * Check if nonce is available, if not asks user for custom nonce. After nonce is set proceeds with data verification and private key verification
   */
  function openConfirmationModal() {
    const { fee, amount } = transactionData;
    const available = balance.liquidUnconfirmed;
    const balanceAfterTransaction = Big(available)
      .minus(fee)
      .minus(amount)
      .toNumber();
    if ((!nonceQuery || !nonceQuery.data) && !customNonce) {
      return setShowModal(ModalStates.NONCE);
    }
    if (balanceAfterTransaction < 0) {
      toast.error(
        "Your are trying to send too many Mina, please check your balance"
      );
      return;
    }
    if (
      transactionData.receiverAddress === "" ||
      transactionData.amount === 0
    ) {
      toast.error("Please insert an address and an amount");
      return;
    }
    if (!isLedgerEnabled) {
      setShowModal(ModalStates.PASSPHRASE);
    } else {
      setStep(1);
    }
  }

  function closeModal() {
    setShowModal("");
  }

  /**
   *  Check if private key is not empty
   */
  function confirmPrivateKey() {
    if (privateKey === "") {
      toast.error("Please insert a private key");
    } else {
      closeModal();
      setStep(1);
    }
  }

  /**
   * Get back to form
   */
  function stepBackwards() {
    setStep(0);
  }

  /**
   * Check if nonce is not empty
   * @returns number Wallet usable nonce
   */
  function checkNonce() {
    return (
      nonceQuery.data?.accountByKey?.usableNonce ||
      nonceQuery.data?.accountByKey?.usableNonce === 0
    );
  }

  /**
   * If nonce is available from back-end return it, otherwise return the custom nonce
   * @returns number Nonce
   */
  function getNonce() {
    return checkNonce()
      ? parseInt(nonceQuery.data.accountByKey.usableNonce)
      : customNonce;
  }

  /**
   * Broadcast transaction for non ledger wallet
   */
  function sendTransaction() {
    setShowModal(ModalStates.BROADCASTING);
    if (nonceQuery) {
      try {
        const actualNonce = getNonce();
        const publicKey = derivePublicKey(privateKey);
        const keypair = {
          privateKey,
          publicKey,
        };
        const signedPayment = signTransaction(
          transactionData,
          keypair,
          senderAddress,
          actualNonce
        );
        if (signedPayment) {
          const signatureInput = createSignatureInputFromSignature(
            signedPayment.signature
          );
          const paymentInput = createPaymentInputFromPayload(
            signedPayment.payload
          );
          broadcastTransaction({
            variables: { input: paymentInput, signature: signatureInput },
          });
          setSendTransactionFlag(true);
        }
      } catch (e) {
        setShowModal("");
        toast.error(
          "Check if the receiver address and/or the private key are right"
        );
        stepBackwards();
      }
    }
  }

  /**
   * Clear component state
   */
  function clearState() {
    setStep(0);
    setShowModal("");
    setCustomNonce(undefined);
    setTransactionData(initialTransactionData);
    setLedgerTransactionData(undefined);
    setSendTransactionFlag(false);
  }

  /**
   * Close nonce modal
   */
  function closeNonceModal() {
    setShowModal("");
    setCustomNonce(undefined);
  }

  /**
   * Sign transaction with Ledger
   */
  const sendLedgerTransaction = async () => {
    try {
      await isMinaAppOpen();
      const senderAccount = props.sessionData?.ledgerAccount || 0;
      const actualNonce = getNonce();
      setTransactionData({
        ...transactionData,
        nonce: actualNonce.toString(),
      });
      // For now mina-ledger-js doesn't support emojis
      const memo = escapeUnicode(emojiToUnicode(transactionData.memo));
      if(memo.length > 32) {
        throw new Error('Memo field too long')
      }
      const signature = await createAndSignLedgerTransaction(
        senderAccount,
        senderAddress,
        transactionData,
        actualNonce
      );
      setShowModal(ModalStates.BROADCASTING);
      setLedgerTransactionData(signature.signature);
    } catch (e) {
      toast.error(e.message || "An error occurred while loading hardware wallet");
      stepBackwards();
    }
  };

  return (
    <Hoc className="main-container">
      <Spinner show={showLoader}>
        <div className="animate__animated animate__fadeIn">
          {step === 0 ? (
            <TransactionForm
              defaultFee={feeQuery?.data?.estimatedFee?.txFees?.average || 0}
              fastFee={feeQuery?.data?.estimatedFee?.txFees?.fast || 0}
              nextStep={openConfirmationModal}
              transactionData={transactionData}
              setData={setTransactionData}
            />
          ) : isLedgerEnabled ? (
            <ConfirmLedgerTransaction transactionData={transactionData} />
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
          close={closeModal}
        >
          <PrivateKeyModal
            confirmPrivateKey={confirmPrivateKey}
            closeModal={closeModal}
            setPrivateKey={setPrivateKey}
          />
        </ModalContainer>
        <ModalContainer
          show={showModal === ModalStates.BROADCASTING}
          close={closeModal}
        >
          <BroadcastTransaction />
        </ModalContainer>
        <ModalContainer
          show={showModal === ModalStates.NONCE}
          close={closeNonceModal}
        >
          <CustomNonce
            proceedHandler={openConfirmationModal}
            setCustomNonce={setCustomNonce}
          />
        </ModalContainer>
      </Spinner>
    </Hoc>
  );
}
