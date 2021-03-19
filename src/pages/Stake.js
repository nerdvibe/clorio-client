import React, { useState } from "react";
import Banner from "../components/General/Banner";
import StakeTable from "../components/Stake/StakeTable";
import Hoc from "../components/General/Hoc";
import ModalContainer from "../components/Modals/ModalContainer";
import { useQuery, gql, useMutation } from "@apollo/client";
import { getAddress } from "../tools";
import { useEffect } from "react";
import * as CodaSDK from "@o1labs/client-sdk";
import PrivateKeyModal from "../components/Modals/PrivateKeyModal";
import { useHistory } from "react-router-dom";
import ConfirmDelegation from "../components/Modals/ConfirmDelegation";
import CustomDelegation from "../components/Modals/CustomDelegation";
import {isMinaAppOpen, NETWORK, signTransaction, TX_TYPE} from "../tools/ledger/ledger";
import { getDefaultValidUntilField, isLedgerEnabled, toNanoMINA } from "../tools/utils";
import LedgerLoader from "../components/General/LedgerLoader";
import CustomNonce from "../components/Modals/CustomNonce";
import Button from "../components/General/Button";
import {feeOrDefault} from "../tools/fees";

const ITEMS_PER_PAGE = 10;

const VALIDATORS = gql`
  query validators($offset: Int!) {
    validators(limit: ${ITEMS_PER_PAGE}, offset: $offset) {
      fee
      id
      image
      name
      publicKey
      website
    }
  }
`;

const NEWS = gql`
  query NewsValidators {
    news_validators(limit: 10) {
      title
      subtitle
      link
      cta
      cta_color
    }
  }
`;

const GET_NONCE_AND_DELEGATE = gql`
  query accountByKey($publicKey: String!) {
    accountByKey(publicKey: $publicKey) {
      delegate {
        publicKey
      }
      usableNonce
    }
  }
`;

const GET_FEE = gql`
  query GetFees {
    estimatedFee {
      average
    }
  }
`;

const BROADCAST_DELEGATION = gql`
  mutation broadcastDelegation(
    $input: SendDelegationInput!
    $signature: SignatureInput
  ) {
    broadcastDelegation(input: $input, signature: $signature) {
      id
    }
  }
`;

export default (props) => {
  const ModalStates = Object.freeze({
    PASSPHRASE: "passphrase",
    CONFIRM_DELEGATION: "confirm",
    CUSTOM_DELEGATION: "custom",
    NONCE: "nonce",
  });
  const ledgerEnabled = isLedgerEnabled();
  const [delegateData, setDelegate] = useState({});
  const [currentDelegate, setCurrentDelegate] = useState("");
  const [showModal, setShowModal] = useState("");
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [customDelegate, setCustomDelegate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [offset, setOffset] = useState(0);
  const [customNonce, setCustomNonce] = useState(undefined);
  const validators = useQuery(VALIDATORS, { variables: { offset } });
  const fee = useQuery(GET_FEE);
  const news = useQuery(NEWS);
  const nonceAndDelegate = useQuery(GET_NONCE_AND_DELEGATE, {
    variables: { publicKey: props.sessionData.address },
  });
  const history = useHistory();
  const [ledgerTransactionData, setLedgerTransactionData] = useState(undefined);
  const [broadcastDelegation, broadcastResult] = useMutation(
    BROADCAST_DELEGATION,
    {
      onError: (error) => {
        props.showGlobalAlert(error.message, "error-toast");
        return clearState();
      },
    }
  );
  getAddress((address) => {
    setAddress(address);
  });

  useEffect(() => {
    if (
      nonceAndDelegate.data &&
      nonceAndDelegate.data.accountByKey &&
      nonceAndDelegate.data.accountByKey.delegate
    ) {
      setCurrentDelegate(nonceAndDelegate.data.accountByKey.delegate.publicKey);
    }
  }, [nonceAndDelegate.data]);

  useEffect(() => {
    if (ledgerEnabled && !ledgerTransactionData) {
      if (showModal === ModalStates.PASSPHRASE) {
        const transactionListener = signLedgerTransaction(
          setLedgerTransactionData
        );
        return transactionListener.unsubscribe;
      }
    }
  }, [ledgerEnabled, ledgerTransactionData, showModal]);

  useEffect(() => {
    if (ledgerTransactionData) {
      const actualNonce = getNonce();
      const averageFee = toNanoMINA(fee.data.estimatedFee.average);
      const SignatureInput = {
        rawSignature: ledgerTransactionData,
      };
      const SendPaymentInput = {
        nonce: actualNonce.toString(),
        memo: "",
        fee: averageFee.toString(),
        to: delegateData.publicKey,
        from: address,
        validUntil: getDefaultValidUntilField(),
      };
      broadcastDelegation({
        variables: { input: SendPaymentInput, signature: SignatureInput },
      });
    }
  }, [ledgerTransactionData]);

  if (!showSuccess && broadcastResult && broadcastResult.data) {
    clearState();
    setShowSuccess(true);
    props.showGlobalAlert(
      "Delegation successfully broadcasted",
      "success-toast"
    );
    history.push("/stake");
  }

  /**
   * Sign stake delegation using Coda SDK through private key
   */
  function signStakeDelegate() {
    try {
      const actualNonce = getNonce();
      const publicKey = CodaSDK.derivePublicKey(privateKey);
      const keypair = {
        privateKey: privateKey,
        publicKey: publicKey,
      };
      const stakeDelegation = {
        to: delegateData.publicKey,
        from: address,
        fee: toNanoMINA(fee.data.estimatedFee.average),
        nonce: actualNonce,
      };
      const signStake = CodaSDK.signStakeDelegation(stakeDelegation, keypair);
      if (signStake) {
        const SignatureInput = {
          scalar: signStake.signature.scalar,
          field: signStake.signature.field,
        };
        const SendPaymentInput = {
          nonce: signStake.payload.nonce,
          fee: signStake.payload.fee,
          validUntil: signStake.payload.validUntil,
          to: signStake.payload.to,
          from: signStake.payload.from,
        };
        broadcastDelegation({
          variables: {
            input: SendPaymentInput,
            signature: SignatureInput,
          },
        });
        setShowModal("");
      }
    } catch (e) {
      props.showGlobalAlert(
        "There was an error processing your delegation, please try again later.",
        "error-toast"
      );
    }
  }

  /**
   * Set delegate private key on component state, open confirmation modal
   * @param {string} delegate Delegate private key
   */
  function openModal(delegate) {
    setDelegate(delegate);
    setShowModal(ModalStates.CONFIRM_DELEGATION);
  }

  /**
   * Open modal for custom private key insertion
   */
  function openCustomDelegateModal() {
    setShowModal(ModalStates.CUSTOM_DELEGATION);
  }

  /**
   * Close every modal and clear component custom nonce and custom delegate
   */
  function closeModal() {
    setShowModal("");
    setCustomNonce(undefined);
    setCustomDelegate(undefined);
  }

  /**
   * If nonce is not available and no custom nonce has already been asked, ask user for a custom nonce. Otherwise proceeds to private key insertion modal
   */
  function confirmDelegate() {
    if ((!nonceAndDelegate || !nonceAndDelegate.data) && !customNonce) {
      setShowModal(ModalStates.NONCE);
    } else if (customDelegate) {
      nonceAndDelegate.refetch({ publicKey: props.sessionData.address });
      setShowModal(ModalStates.PASSPHRASE);
      setDelegate({ publicKey: customDelegate });
    } else {
      nonceAndDelegate.refetch({ publicKey: props.sessionData.address });
      setShowModal(ModalStates.PASSPHRASE);
    }
  }

  /**
   * User confirmed delegate public key, proceeds to private key insertion
   * @param {string} delegate Delegate private key
   */
  function confirmCustomDelegate(delegate) {
    nonceAndDelegate.refetch({ publicKey: props.sessionData.address });
    setShowModal(ModalStates.PASSPHRASE);
    setDelegate({ publicKey: delegate });
  }

  /**
   * Close all modals, clears custom nonce state
   */
  function closeNonceModal() {
    setShowModal("");
    setCustomNonce(undefined);
  }

  /**
   * If news are available, render news banner
   * @returns HTMLElement
   */
  function renderBanner() {
    if (
      news.data &&
      news.data.news_validators &&
      news.data.news_validators.length > 0
    ) {
      const latest = news.data.news_validators[0];
      return (
        <Banner
          title={latest.title}
          subtitle={latest.subtitle}
          link={latest.link}
          cta={latest.cta}
          cta_color={latest.cta_color}
        />
      );
    }
  }

  /**
   * Clear component state
   */
  function clearState() {
    setShowModal("");
    setDelegate({});
    setCustomNonce(undefined);
    setCustomDelegate("");
    setLedgerTransactionData(undefined);
  }

  /**
   * Set query offset based on selected page
   * @param {number} page Page number
   */
  function changeOffset(page) {
    const data = (page - 1) * ITEMS_PER_PAGE;
    setOffset(data);
  }

  /**
   * Sign delegation through ledger and
   * @param {function} callback Callback function called after ledger signed Delegation
   */
  async function signLedgerTransaction(callback) {
    try {
      await isMinaAppOpen();
      const actualNonce = getNonce();
      const senderAccount = props.sessionData.ledgerAccount || 0;
      const transactionToSend = {
        senderAccount,
        senderAddress: address,
        receiverAddress: delegateData.publicKey,
        fee: +toNanoMINA(feeOrDefault(fee?.data?.estimatedFee?.average || '0')),
        amount: 0,
        nonce: actualNonce,
        // TODO: FIX HARDCODING!
        txType: TX_TYPE.DELEGATION,
        // TODO: FIX HARDCODING!
        networkId: NETWORK.DEVNET,
        validUntil: +getDefaultValidUntilField(),
      };

      const signature = await signTransaction(transactionToSend);
      setShowModal(ModalStates.BROADCASTING);
      callback(signature.signature);
    } catch (e) {
      props.showGlobalAlert(
        e.message || "An error occurred while loading hardware wallet",
        "error-toast"
      );
      setShowModal(undefined);
    }
  }

  /**
   * If nonce is available from query, returns it, otherwise custom nonce is returned
   * @returns number Nonce number
   */
  function getNonce() {
    if (nonceAndDelegate.data && nonceAndDelegate.data.accountByKey) {
      return parseInt(nonceAndDelegate.data.accountByKey.usableNonce);
    } else if (nonceAndDelegate.data.accountByKey.usableNonce === 0) {
      return 0;
    }
    return customNonce;
  }

  return (
    <Hoc className="main-container">
      <div className="animate__animated animate__fadeIn">
        {renderBanner()}
        <StakeTable
          toggleModal={openModal}
          validators={validators}
          currentDelegate={currentDelegate}
          openCustomDelegateModal={openCustomDelegateModal}
          setOffset={changeOffset}
          page={offset / ITEMS_PER_PAGE + 1}
        />
      </div>
      <ModalContainer
        show={showModal === ModalStates.CONFIRM_DELEGATION}
        close={closeModal}
      >
        <ConfirmDelegation
          name={delegateData.name}
          closeModal={closeModal}
          confirmDelegate={confirmDelegate}
        />
      </ModalContainer>
      <ModalContainer
        show={showModal === ModalStates.NONCE}
        close={closeNonceModal}
      >
        <CustomNonce
          proceedHandler={confirmDelegate}
          setCustomNonce={setCustomNonce}
        />
      </ModalContainer>
      <ModalContainer
        show={showModal === ModalStates.PASSPHRASE}
        close={closeModal}
      >
        {ledgerEnabled ? (
          <div className="mx-auto">
            <h2>Please confirm transaction </h2>
            <div className="v-spacer" />
            <h5 className="align-center mx-auto">
              Waiting your hardware wallet to confirm transaction
            </h5>
            <div className="v-spacer" />
            <LedgerLoader />
            <div className="v-spacer" />
            <Button
              onClick={closeModal}
              className="link-button full-width-align-center"
              text="Cancel"
            />
          </div>
        ) : (
          <PrivateKeyModal
            confirmPrivateKey={signStakeDelegate}
            closeModal={closeModal}
            setPrivateKey={setPrivateKey}
            subtitle={
              customDelegate && `You are going to delegate ${customDelegate}`
            }
          />
        )}
      </ModalContainer>
      <ModalContainer
        show={showModal === ModalStates.CUSTOM_DELEGATION}
        close={closeModal}
      >
        <CustomDelegation
          closeModal={closeModal}
          confirmCustomDelegate={confirmCustomDelegate}
        />
      </ModalContainer>
    </Hoc>
  );
};
