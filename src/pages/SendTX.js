import React, { useState, useEffect } from "react";
import TransactionForm from "../components/Transactions/TransactionForm";
import ConfirmTransaction from "../components/Modals/ConfirmTransaction";
import ConfirmLedgerTransaction from "../components/Modals/ConfirmLedgerTransaction";
import Hoc from "../components/General/Hoc";
import { getAddress } from "../tools";
import * as CodaSDK from "@o1labs/client-sdk";
import ModalContainer from "../components/Modals/ModalContainer";
import BroadcastTransaction from "../components/Modals/BroadcastTransaction";
import { useQuery, gql, useMutation } from "@apollo/client";
import PrivateKeyModal from "../components/Modals/PrivateKeyModal";
import { useHistory } from "react-router-dom";
import {emojiToUnicode, escapeUnicode, isMinaAppOpen, NETWORK, signTransaction, TX_TYPE} from "../tools/ledger/ledger";
import { getDefaultValidUntilField, toNanoMINA } from "../tools/utils";
import {Big} from "big.js";
import CustomNonce from "../components/Modals/CustomNonce";
import { useContext } from "react";
import { BalanceContext } from "../context/BalanceContext";
import Spinner from "../components/General/Spinner";
import { toast } from 'react-toastify';

const GET_FEE = gql`
  query GetFees {
    estimatedFee {
      txFees{
        average
        fast
      }
    }
  }
`;

const GET_NONCE = gql`
  query accountByKey($publicKey: String!) {
    accountByKey(publicKey: $publicKey) {
      usableNonce
    }
  }
`;

const BROADCAST_TRANSACTION = gql`
  mutation broadcastTransaction(
    $input: SendPaymentInput!
    $signature: SignatureInput!
  ) {
    broadcastTransaction(input: $input, signature: $signature) {
      id
    }
  }
`;

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
  const [address, setAddress] = useState("");
  const [customNonce, setCustomNonce] = useState(undefined);
  const [showLoader, setShowLoader] = useState(true);
  const [ledgerTransactionData, setLedgerTransactionData] = useState(undefined);
  const { balance } = useContext(BalanceContext);
  const [transactionData, setTransactionData] = useState(
    initialTransactionData
    );
  const nonce = useQuery(GET_NONCE, {
    variables: { publicKey: address },
    skip: address === "",
  });
  const fee = useQuery(GET_FEE,{
    onCompleted:(data)=>{
    if(data?.estimatedFee?.txFees?.average){
        setTransactionData({
          ...transactionData,
          fee:toNanoMINA(data.estimatedFee.txFees.average)
        })
        setShowLoader(false);
      }
    },
    onError:()=>{
      setShowLoader(false);
    }
  },);
  const [broadcastTransaction, broadcastResult] = useMutation(
    BROADCAST_TRANSACTION,
    {
      onError: (error) => {
        toast.error(error.message)
        clearState();
      },
    }
  );
  const history = useHistory();

  // If broadcasted successfully return to initial page state
  if (showModal && broadcastResult && broadcastResult.data && sendTransactionFlag) {
    clearState();
    toast.success("Transaction successfully broadcasted");
    history.replace("/send-tx");
  }

  // Get sender public key
  getAddress((publicKey) => {
    setAddress(publicKey);
  });

  // Listen for ledger action
  useEffect(() => {
    if (isLedgerEnabled && !ledgerTransactionData) {
      if (step === 1) {
        const transactionListener = sendLedgerTransaction(
          setLedgerTransactionData
        );
        return transactionListener.unsubscribe;
      }
    }
  }, [isLedgerEnabled, ledgerTransactionData, step]);

  // Ledger data arrived, broadcast transaction
  useEffect(() => {
    try {
      if (ledgerTransactionData) {
        const amount = transactionData.amount;
        const fee = transactionData.fee;
        const SignatureInput = {
          rawSignature: ledgerTransactionData,
        };
        const SendPaymentInput = {
          // nonce
          // memo
          // fee
          // amount
          // to
          // from
          nonce: transactionData.nonce,
          memo: transactionData.memo,
          fee: fee.toString(),
          amount: amount.toString(),
          to: transactionData.receiverAddress,
          from: address,
          // validUntil: getDefaultValidUntilField(),
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
   * Check if nonce is available, if not asks user for custom nonce. After is set proceeds data verification and to private key verification
   */
  function openConfirmationModal() {
    if ((!nonce || !nonce.data) && !customNonce) {
      return setShowModal(ModalStates.NONCE);
    }
    const available = balance.liquidUnconfirmed;
    const fee = transactionData.fee;
    const amount = transactionData.amount;
    const balanceAfterTransaction = Big(available)
      .minus(fee)
      .minus(amount)
      .toNumber();
    if (balanceAfterTransaction < 0) {
      toast.error("Your are trying to send too many Mina, please check your balance");
      return
    }
    if (transactionData.receiverAddress === "" || transactionData.amount === 0) {
      toast.error( "Please insert an address and an amount");
      return
    }
    nonce.refetch({ publicKey: address });
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
      nonce.data &&
      (nonce.data.accountByKey.usableNonce ||
        nonce.data.accountByKey.usableNonce === 0)
    );
  }

  /**
   * Broadcast transaction for non ledger wallet
   */
  function sendTransaction() {
    setShowModal(ModalStates.BROADCASTING);
    if (nonce) {
      try {
        const actualNonce = checkNonce()
          ? parseInt(nonce.data.accountByKey.usableNonce)
          : customNonce;
        const publicKey = CodaSDK.derivePublicKey(privateKey);
        const dataToSend = {
          privateKey,
          publicKey,
        };
        const fee = transactionData.fee;
        const amount = transactionData.amount;
        const signedPayment = CodaSDK.signPayment(
          {
            from: address,
            to: transactionData.receiverAddress,
            amount,
            fee,
            nonce: actualNonce,
            memo: transactionData.memo,
          },
          dataToSend
        );
        if (signedPayment) {
          const SignatureInput = {
            scalar: signedPayment.signature.scalar,
            field: signedPayment.signature.field,
          };
          const SendPaymentInput = {
            nonce: signedPayment.payload.nonce,
            memo: signedPayment.payload.memo,
            fee: signedPayment.payload.fee,
            amount: signedPayment.payload.amount,
            to: signedPayment.payload.to,
            from: signedPayment.payload.from,
          };
          broadcastTransaction({
            variables: { input: SendPaymentInput, signature: SignatureInput },
          });
          setSendTransactionFlag(true);
        }
      } catch (e) {
        setShowModal("");
        toast.error("Check if the receiver address and/or the private key are right");
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
   * Broadcast Ledger transaction
   * @param {function} callback Callback that loads on ledger sign process end
   */
  async function sendLedgerTransaction(callback) {
      try {
        await isMinaAppOpen();
        const actualNonce = checkNonce()
          ? parseInt(nonce.data.accountByKey.usableNonce)
          : customNonce;
        setTransactionData({
          ...transactionData,
          nonce: actualNonce.toString(),
        });
        // For now mina-ledger-js doesn't support emojis
        const memo = escapeUnicode(emojiToUnicode(transactionData.memo));
        if(memo.length > 32) {
          throw new Error('Memo field too long')
        }
        const senderAccount = props.sessionData.ledgerAccount || 0;
        const transactionToSend = {
          senderAccount,
          senderAddress: address,
          receiverAddress: transactionData.receiverAddress,
          fee: +transactionData.fee,
          amount: +transactionData.amount,
          memo,
          nonce: actualNonce,
          // TODO: FIX HARDCODING!
          txType: TX_TYPE.PAYMENT,
          // TODO: FIX HARDCODING!
          networkId: NETWORK.DEVNET,
          validUntil: +getDefaultValidUntilField(),
        };
        const signature = await signTransaction(transactionToSend);
        setShowModal(ModalStates.BROADCASTING);
        callback(signature.signature);
      } catch (e) {
        toast.error(e.message || "An error occurred while loading hardware wallet");
        stepBackwards()
      }
  }

  return (
    <Hoc className="main-container">
      <Spinner show={showLoader}>
        <div className="animate__animated animate__fadeIn">
          {step === 0 ? (
            <TransactionForm
              defaultFee={fee?.data?.estimatedFee?.txFees?.average || 0}
              fastFee={fee?.data?.estimatedFee?.txFees?.fast || 0}
              nextStep={openConfirmationModal}
              transactionData={transactionData}
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
