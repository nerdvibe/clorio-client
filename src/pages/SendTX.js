import React, { useState, useEffect, useContext} from "react";
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
import {createAndSignLedgerTransaction} from "../tools/ledger/ledger";
import {createPaymentInputFromPayload, createSignatureInputFromSignature, signTransaction} from "../tools/transactions"
import { toNanoMINA } from "../tools/utils";
import {Big} from "big.js";
import CustomNonce from "../components/Modals/CustomNonce";
import { BalanceContext } from "../context/BalanceContext";
import Spinner from "../components/General/Spinner";
import { derivePublicKey } from "@o1labs/client-sdk";
import { BROADCAST_TRANSACTION, GET_FEE, GET_NONCE } from "../tools/query";

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
  const isLedgerEnabled = props.sessionData.ledger;
  const [privateKey, setPrivateKey] = useState("");
  const [sendTransactionFlag, setSendTransactionFlag] = useState(false);
  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [customNonce, setCustomNonce] = useState(undefined);
  const [showLoader, setShowLoader] = useState(true);
  const [ledgerTransactionData, setLedgerTransactionData] = useState(undefined);
  const { balance } = useContext(BalanceContext);
  const [transactionData, setTransactionData] = useState(
    initialTransactionData
    );
  const nonceQuery = useQuery(GET_NONCE, {
    variables: { publicKey: senderAddress },
    skip: senderAddress === "",
  });
  const feeQuery = useQuery(GET_FEE,{
    onCompleted:(data)=>{
      if(data?.estimatedFee?.txFees?.average){
        setTransactionData({
          ...transactionData,
          fee:toNanoMINA(data.estimatedFee.txFees.average)
        })
      }
      setShowLoader(false);
    },
    onError:()=>{
      setShowLoader(false);
    }
  });
  const [broadcastTransaction, broadcastResult] = useMutation(
    BROADCAST_TRANSACTION,
    {
      onError: (error) => {
        props.showGlobalAlert(error.message, "error-toast");
        clearState();
      },
    }
  );
  const history = useHistory();

  // If broadcasted successfully return to initial page state
  if (showModal && (broadcastResult && broadcastResult.data) && sendTransactionFlag) {
    clearState();
    props.showGlobalAlert(
      "Transaction successfully broadcasted",
      "success-toast"
    );
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
  }, [isLedgerEnabled, ledgerTransactionData, step]);

  /**
   * Ledger data arrived, broadcast transaction
   */
  useEffect(() => {
    try {
      if (ledgerTransactionData) {
        const {amount,fee} = transactionData;
        const SendPaymentInput = createLedgerPaymentInputFromPayload(transactionData,fee,amount,senderAddress);
        const SignatureInput = {
          rawSignature: ledgerTransactionData,
        };
        broadcastTransaction({
          variables: { input: SendPaymentInput, signature: SignatureInput },
        });
        setSendTransactionFlag(true);
      }
    } catch (e) {
      props.showGlobalAlert(
        "There was an error broadcasting delegation",
        "error-toast"
      );
    }
  }, [ledgerTransactionData]);

  /**
   * Clean component state on dismount
   */
  useEffect(() => {
    return () => {
      setPrivateKey("")
    }
  }, [])


  /**
   * Check if nonce is available, if not asks user for custom nonce. After nonce is set proceeds with data verification and private key verification
   */
  function openConfirmationModal() {
    const {fee,amount}= transactionData;
    const available = balance.liquidUnconfirmed;
    const balanceAfterTransaction = Big(available)
      .minus(fee)
      .minus(amount)
      .toNumber();
    if ((!nonceQuery || !nonceQuery.data) && !customNonce) {
      return setShowModal(ModalStates.NONCE);
    }
    if (balanceAfterTransaction < 0) {
      props.showGlobalAlert(
        "Your are trying to send too many Mina, please check your balance",
        "error-toast"
      );
      return
    }
    if (transactionData.receiverAddress === "" || transactionData.amount === 0) {
      props.showGlobalAlert(
        "Please insert an address and an amount",
        "error-toast"
      );
      return
    }
    nonceQuery.refetch({ publicKey: senderAddress });
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
      props.showGlobalAlert("Please insert a private key", "error-toast");
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
      nonceQuery.data &&
      (nonceQuery.data.accountByKey.usableNonce ||
        nonceQuery.data.accountByKey.usableNonce === 0)
    );
  }

  /**
   * If nonce is available from back-end return it, otherwise return the custom nonce
   * @returns number Nonce
   */
  function getNonce(){
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
        const actualNonce = getNonce()
        const publicKey = derivePublicKey(privateKey);
        const keypair = {
          privateKey,
          publicKey,
        };
        const signedPayment = signTransaction(transactionData,keypair,senderAddress,actualNonce);
        if (signedPayment) {
          const signatureInput = createSignatureInputFromSignature(signedPayment.signature)
          const paymentInput = createPaymentInputFromPayload(signedPayment.payload);
          broadcastTransaction({
            variables: { input: paymentInput, signature: signatureInput },
          });
          setSendTransactionFlag(true);
        }
      } catch (e) {
        setShowModal("");
        props.showGlobalAlert(
          "Check if the receiver address and/or the private key are right",
          "error-toast"
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
  async function sendLedgerTransaction() {
      try {
        const senderAccount = props.sessionData.ledgerAccount || 0;
        const actualNonce = getNonce();
        setTransactionData({
          ...transactionData,
          nonce: actualNonce.toString(),
        });
        const signature = await createAndSignLedgerTransaction(senderAccount,senderAddress,transactionData,actualNonce);
        setShowModal(ModalStates.BROADCASTING);
        setLedgerTransactionData(signature.signature);
      } catch (e) {
        props.showGlobalAlert(
          e.message || "An error occurred while loading hardware wallet",
          "error-toast"
        );
        stepBackwards()
      }
  }

  return (
    <Hoc className="main-container">
      <Spinner show={showLoader}>
        <div className="animate__animated animate__fadeIn">
          {step === 0 ? (
            <TransactionForm
              defaultFee={feeQuery?.data?.estimatedFee?.average || 0}
              fastFee={feeQuery?.data?.estimatedFee?.fast || 0}
              nextStep={openConfirmationModal}
              transactionData={transactionData}
              showGlobalAlert={props.showGlobalAlert}
              setData={setTransactionData}
            />
          ) : isLedgerEnabled ? (
            <ConfirmLedgerTransaction
              transactionData={transactionData}
            />
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
            openModal={openConfirmationModal}
            setCustomNonce={setCustomNonce}
          />
        </ModalContainer>
      </Spinner>
    </Hoc>
  );
}
