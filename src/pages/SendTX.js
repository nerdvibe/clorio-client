import React, { useEffect, useState } from "react";
import Wallet from "../components/Wallet";
import TransactionForm from "../components/TransactionForm";
import ConfirmTransaction from "../components/ConfirmTransaction";
import ConfirmLedgerTransaction from "../components/ConfirmLedgerTransaction";
import Hoc from "../components/Hoc";
import Alert from "../components/General/Alert";
import { getAddress } from "../tools";
import * as CodaSDK from "@o1labs/client-sdk";
import Modal from "../components/Modal";
import { useQuery, gql, useMutation } from "@apollo/client";
import PrivateKeyModal from "../components/PrivateKeyModal";
import { useHistory } from "react-router-dom";
import ledger from "../tools/ledger";

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

export default function SendTX(props) {
  const ModalStates = Object.freeze({
    PASSPHRASE: "passphrase",
    BROADCASTING: "broadcasting",
  });
  const isLedgerEnabled = props.sessionData.ledger;
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
  const [ledgerTransactionData, setLedgerTransactionData] = useState(undefined);
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

  useEffect(() => {
    try {
      if (ledgerTransactionData) {
        const amount = transactionData.amount * 1000000000;
        const fee = transactionData.fee * 1000000000;
        const SignatureInput = {
          rawSignature: ledgerTransactionData,
        };
        const SendPaymentInput = {
          nonce: transactionData.nonce.toString(),
          memo: transactionData.memo,
          fee: fee.toString(),
          amount: amount.toString(),
          to: transactionData.address,
          from: address,
          validUntil: "",
        };
        broadcastTransaction({
          variables: { input: SendPaymentInput, signature: SignatureInput },
        });
      }
    } catch (e) {
      props.showGlobalAlert("There was an error broadcasting delegation");
    }
  }, [ledgerTransactionData]);

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
      <Modal show={showModal === ModalStates.PASSPHRASE} close={closeModal}>
        <PrivateKeyModal
          confirmPrivateKey={confirmPrivateKey}
          closeModal={closeModal}
          setPrivateKey={setPrivateKey}
        />
      </Modal>
      <Modal show={showModal === ModalStates.BROADCASTING} close={closeModal}>
        {renderBroadcastingModal()}
      </Modal>
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

  function renderBroadcastingModal() {
    return (
      <div className="mx-auto">
        <h2>Broadcasting your transaction</h2>
        <div className="v-spacer" />
        <h5 className="align-center mx-auto">
          We are broadcasting your transaction to the network
        </h5>
        <div className="v-spacer" />
      </div>
    );
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
    if (!isLedgerEnabled) {
      return setshowModal(ModalStates.PASSPHRASE);
    } else {
      setStep(1);
    }
  }

  function closeModal() {
    setshowModal("");
  }

  function confirmPrivateKey() {
    if (privateKey === "") {
      showToast("Please insert a private key");
    } else {
      setshowModal("");
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

  async function sendLedgerTransaction(fn) {
    const updateDevices = async () => {
      try {
        const dataToSend = {
          account: address,
          sender: address,
          recipient: transactionData.address,
          fee: transactionData.fee,
          amount: transactionData.amount,
          nonce: transactionData.nonce,
          txType: 1,
          networkId: 1,
          validUntil: "z",
        };
        const response = await ledger.signTransaction(dataToSend);
        fn(response);
      } catch (e) {
        props.showGlobalAlert(
          "An error occurred while loading hardware wallet"
        );
        history.push("/");
      }
    };
    // eslint-disable-next-line no-undef
    try {
      setImmediate(updateDevices);
    } catch (e) {
      props.showGlobalAlert("An error occurred while loading hardware wallet");
      history.push("/");
    }
  }
}
