import React, { useState } from "react";
import Wallet from "../components/General/Wallet";
import TransactionForm from "../components/Transactions/TransactionForm";
import ConfirmTransaction from "../components/Modals/ConfirmTransaction";
import ConfirmLedgerTransaction from "../components/Transactions/ConfirmLedgerTransaction";
import Hoc from "../components/General/Hoc";
import Alert from "../components/General/Alert";
import { getAddress } from "../tools";
import * as CodaSDK from "@o1labs/client-sdk";
import ModalContainer from "../components/Modals/ModalContainer";
import BroadcastTransaction from "../components/Modals/BroadcastTransaction";
import { useQuery, gql, useMutation } from "@apollo/client";
import PrivateKeyModal from "../components/Modals/PrivateKeyModal";
import { useHistory } from "react-router-dom";

const GET_FEE = gql`
  query GetFees {
    estimatedFee {
      average
      fast
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
  amount: 0,
  address: "",
  fee: 0.1,
  nonce: 0,
  memo: "",
};

export default function SendTX() {
  const ModalStates = Object.freeze({
    PASSPHRASE: "passphrase",
    BROADCASTING: "broadcasting",
  });
  const isLedgerEnabled = false;
  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [step, setStep] = useState(0);
  const [showModal, setshowModal] = useState("");
  const [balance, setbalance] = useState(0);
  const [address, setAddress] = useState("");
  const [transactionData, settransactionData] = useState(
    initialTransactionData
  );
  const nonce = useQuery(GET_NONCE, {
    variables: { publicKey: address },
    skip: address === "",
  });
  const fee = useQuery(GET_FEE);
  const [broadcastTransaction, broadcastResult] = useMutation(
    BROADCAST_TRANSACTION
  );
  const history = useHistory();

  if (showModal && broadcastResult && broadcastResult.data) {
    clearState();
    setShowSuccess(true);
    history.push("/send-tx");
  }

  getAddress((address) => {
    setAddress(address);
  });

  function setBalance(data) {
    if (!balance) {
      setbalance(data);
    } else {
      const difference =
        data.total !== balance.total ||
        data.liquid !== balance.liquid ||
        data.liquidUnconfirmed !== balance.liquidUnconfirmed;
      if (difference) {
        setbalance(data);
      }
    }
  }

  function openModal() {
    const available = +balance.liquidUnconfirmed * 1000000000;
    const fee = +transactionData.fee * 1000000000;
    const amount = +transactionData.amount * 1000000000;
    if (available < fee + amount) {
      return showToast("Please check your balance");
    }
    if (transactionData.address === "" || transactionData.amount === 0) {
      return showToast("Please insert an address and an amount");
    }
    nonce.refetch({ publicKey: address });
    return setshowModal(ModalStates.PASSPHRASE);
  }

  function closeModal() {
    setshowModal("");
  }

  function confirmPrivateKey() {
    if (privateKey === "") {
      showToast("Please insert a private key");
    } else {
      closeModal()
      setStep(1);
    }
  }

  function showToast(message) {
    setShow(true);
    setAlertText(message);
  }

  function hideToast() {
    setShow(false);
  }

  function stepBackwards() {
    setStep(0);
  }

  function sendTransaction() {
    setshowModal(ModalStates.BROADCASTING);
    if (nonce) {
      const actualNonce =
        nonce.data && nonce.data.accountByKey.usableNonce
          ? parseInt(nonce.data.accountByKey.usableNonce)
          : 0;
      try {
        const publicKey = CodaSDK.derivePublicKey(privateKey);
        const dataToSend = {
          privateKey,
          publicKey,
        };
        const fee = +transactionData.fee * 1000000000;
        const amount = +transactionData.amount * 1000000000;
        const signedPayment = CodaSDK.signPayment(
          {
            from: address,
            to: transactionData.address,
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
            validUntil: signedPayment.payload.validUntil,
            amount: signedPayment.payload.amount,
            to: signedPayment.payload.to,
            from: signedPayment.payload.from,
          };
          broadcastTransaction({
            variables: { input: SendPaymentInput, signature: SignatureInput },
          });
        }
      } catch (e) {
        setshowModal("");
        showToast("Check if receiver address and/or private key are right");
        stepBackwards();
      }
    }
  }

  function clearState() {
    setShow(false);
    setAlertText("");
    setStep(0);
    setshowModal("");
    settransactionData(initialTransactionData);
  }

  return (
    <Hoc className="main-container">
      <Wallet setBalance={setBalance} />
      {step === 0 ? (
        <TransactionForm
          defaultFee={fee.data ? fee.data.estimatedFee.average : 0}
          fastFee={fee.data ? fee.data.estimatedFee.fast : 0}
          nextStep={openModal}
          transactionData={transactionData}
          showToast={showToast}
          setData={settransactionData}
        />
      ) : isLedgerEnabled ? (
        <ConfirmLedgerTransaction
          transactionData={transactionData}
          stepBackward={stepBackwards}
          sendTransaction={openModal}
        />
      ) : (
        <ConfirmTransaction
          transactionData={transactionData}
          stepBackward={stepBackwards}
          sendTransaction={sendTransaction}
        />
      )}
      <ModalContainer show={showModal === ModalStates.PASSPHRASE} close={closeModal}>
        <PrivateKeyModal
          confirmPrivateKey={confirmPrivateKey}
          closeModal={closeModal}
          setPrivateKey={setPrivateKey}
        />
      </ModalContainer>
      <ModalContainer show={showModal === ModalStates.BROADCASTING} close={closeModal}>
        <BroadcastTransaction /> 
      </ModalContainer>
      <Alert show={show} hideToast={hideToast} type={"error-toast"}>
        {alertText}
      </Alert>
      <Alert
        show={showSuccess}
        hideToast={() => setShowSuccess(false)}
        type={"success-toast"}
      >
        Transaction successfully broadcasted
      </Alert>
    </Hoc>
  );
}
