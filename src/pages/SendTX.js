import React, { useState, useEffect } from "react";
import Wallet from "../components/General/Wallet";
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
import ledger from "../tools/ledger";
import { getDefaultValidUntilField, toNanoMINA } from "../tools/utils";
import Big from "big.js";
import CustomNonce from "../components/Modals/CustomNonce";

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
  amount: toNanoMINA(0),
  address: "",
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
  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState("");
  const [balance, setBalanceData] = useState(0);
  const [address, setAddress] = useState("");
  const [customNonce, setCustomNonce] = useState(undefined);
  const [ledgerTransactionData, setLedgerTransactionData] = useState(undefined);
  const [transactionData, setTransactionData] = useState(
    initialTransactionData
  );
  const nonce = useQuery(GET_NONCE, {
    variables: { publicKey: address },
    skip: address === "",
  });
  const fee = useQuery(GET_FEE);
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
  if (showModal && broadcastResult && broadcastResult.data) {
    clearState();
    props.showGlobalAlert(
      "Transaction successfully broadcasted",
      "success-toast"
    );
    history.push("/send-tx");
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
          nonce: transactionData.nonce,
          memo: transactionData.memo,
          fee: fee.toString(),
          amount: amount.toString(),
          to: transactionData.address,
          from: address,
          validUntil: getDefaultValidUntilField(),
        };
        broadcastTransaction({
          variables: { input: SendPaymentInput, signature: SignatureInput },
        });
      }
    } catch (e) {
      props.showGlobalAlert(
        "There was an error broadcasting delegation",
        "error-toast"
      );
    }
  }, [ledgerTransactionData]);

  /**
   * Set wallet balance data from child wallet component
   * @param {Object} data Wallet balance query result
   */
  function setBalance(data) {
    if (!balance) {
      setBalanceData(data);
    } else {
      const difference =
        data.total !== balance.total ||
        data.liquid !== balance.liquid ||
        data.liquidUnconfirmed !== balance.liquidUnconfirmed;
      if (difference) {
        setBalanceData(data);
      }
    }
  }

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
      .sub(fee)
      .sub(amount)
      .toNumber();
    if (balanceAfterTransaction < 0) {
      props.showGlobalAlert(
        "Your are trying to send too many MINA, please check your balance",
        "error-toast"
      );
    }
    if (transactionData.address === "" || transactionData.amount === 0) {
      props.showGlobalAlert(
        "Please insert an address and an amount",
        "error-toast"
      );
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
            to: transactionData.address,
            amount,
            fee,
            nonce: transactionData.nonce,
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
        setShowModal("");
        props.showGlobalAlert(
          "Check if receiver address and/or private key are right",
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
    const updateDevices = async () => {
      try {
        const actualNonce = checkNonce()
          ? parseInt(nonce.data.accountByKey.usableNonce)
          : customNonce;
        setTransactionData({
          ...transactionData,
          nonce: actualNonce.toString(),
        });
        const dataToSend = {
          account: address,
          sender: address,
          recipient: transactionData.address,
          fee: transactionData.fee,
          amount: transactionData.amount,
          nonce: actualNonce,
          txType: 1,
          networkId: 1,
          validUntil: getDefaultValidUntilField(),
        };
        const response = await ledger.signTransaction(dataToSend);
        callback(response);
      } catch (e) {
        props.showGlobalAlert(
          "An error occurred while loading hardware wallet",
          "error-toast"
        );
        clearState();
      }
    };
    try {
      updateDevices();
    } catch (e) {
      props.showGlobalAlert(
        "An error occurred while loading hardware wallet",
        "error-toast"
      );
      clearState();
    }
  }

  return (
    <Hoc className="main-container">
      <Wallet setBalance={setBalance} />
      {step === 0 ? (
        <TransactionForm
          defaultFee={fee.data ? fee.data.estimatedFee.average : 0}
          fastFee={fee.data ? fee.data.estimatedFee.fast : 0}
          nextStep={openConfirmationModal}
          transactionData={transactionData}
          showGlobalAlert={props.showGlobalAlert}
          setData={setTransactionData}
        />
      ) : isLedgerEnabled ? (
        <ConfirmLedgerTransaction
          transactionData={transactionData}
          stepBackward={stepBackwards}
          sendTransaction={openConfirmationModal}
        />
      ) : (
        <ConfirmTransaction
          transactionData={transactionData}
          stepBackward={stepBackwards}
          sendTransaction={sendTransaction}
        />
      )}
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
    </Hoc>
  );
}
