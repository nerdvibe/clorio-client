import React, { useState } from "react";
import Banner from "../components/General/Banner";
import StakeTable from "../components/Stake/StakeTable";
import Wallet from "../components/General/Wallet";
import Hoc from "../components/General/Hoc";
import ModalContainer from "../components/Modals/ModalContainer";
import { useQuery, gql, useMutation } from "@apollo/client";
import { getAddress } from "../tools";
import { useEffect } from "react";
import * as CodaSDK from "@o1labs/client-sdk";
import PrivateKeyModal from "../components/Modals/PrivateKeyModal";
import Alert from "../components/General/Alert";
import { useHistory } from "react-router-dom";
import ConfirmDelegation from "../components/Modals/ConfirmDelegation";
import CustomDelegation from "../components/Modals/CustomDelegation";
import ledger from "../tools/ledger";
import { getDefaultValidUntilField, toNanoMINA } from "../tools/utils";
import LedgerLoader from "../components/General/LedgerLoader";
import CustomNonce from "../components/Modals/CustomNonce";
import Button from "../components/General/Button";

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
  const isLedgerEnabled = props.sessionData.ledger;
  const [delegateData, setDelegate] = useState({});
  const [currentDelegate, setCurrentDelegate] = useState("");
  const [showModal, setShowModal] = useState("");
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [customDelegate, setCustomDelegate] = useState("");
  const [showAlert, setShowAlert] = useState(false);
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
        props.showGlobalAlert(error.message);
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
    if (isLedgerEnabled && !ledgerTransactionData) {
      if (showModal === ModalStates.PASSPHRASE) {
        const transactionListener = sendLedgerTransaction(
          setLedgerTransactionData
        );
        return transactionListener.unsubscribe;
      }
    }
  }, [isLedgerEnabled, ledgerTransactionData, showModal]);


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
    history.push("/stake");
  }

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
      setShowAlert(true);
    }
  }

  function openModal(delegate) {
    setDelegate(delegate);
    setShowModal(ModalStates.CONFIRM_DELEGATION);
  }

  function openCustomDelegateModal() {
    setShowModal(ModalStates.CUSTOM_DELEGATION);
  }

  function closeModal() {
    setShowModal("");
    setCustomNonce(undefined);
    setCustomDelegate(undefined);
  }

  function confirmDelegate() {
    if ((!nonceAndDelegate || !nonceAndDelegate.data) && !customNonce) {
      return setShowModal(ModalStates.NONCE);
    }
    if (customDelegate) {
      nonceAndDelegate.refetch({ publicKey: props.sessionData.address });
      setShowModal(ModalStates.PASSPHRASE);
      setDelegate({ publicKey: customDelegate });
    } else {
      nonceAndDelegate.refetch({ publicKey: props.sessionData.address });
      setShowModal(ModalStates.PASSPHRASE);
    }
  }

  function confirmCustomDelegate(delegate) {
    nonceAndDelegate.refetch({ publicKey: props.sessionData.address });
    setShowModal(ModalStates.PASSPHRASE);
    setDelegate({ publicKey: delegate });
  }

  function closeNonceModal() {
    setShowModal("");
    setCustomNonce(undefined);
  }

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

  function clearState() {
    setShowModal("");
    setDelegate({});
    setCustomNonce(undefined);
    setCustomDelegate("");
    setLedgerTransactionData(undefined);
  }

  function changeOffset(page) {
    const data = (page - 1) * ITEMS_PER_PAGE;
    setOffset(data);
  }
  async function sendLedgerTransaction(callback) {
    const updateDevices = async () => {
      try {
        const actualNonce = getNonce();
        const dataToSend = {
          account: address,
          sender: address,
          recipient: delegateData.publicKey,
          fee: toNanoMINA(fee.data.estimatedFee.average),
          nonce: actualNonce,
          txType: 2,
          networkId: 1,
          validUntil: getDefaultValidUntilField(),
        };
        const response = await ledger.signDelegation(dataToSend);
        callback(response);
      } catch (e) {
        props.showGlobalAlert(
          "An error occurred while loading hardware wallet"
        );
        setShowModal(undefined);
      }
    };
    try {
      updateDevices();
    } catch (e) {
      props.showGlobalAlert("An error occurred while loading hardware wallet");
    }
  }

  function getNonce() {
    if (nonceAndDelegate.data && nonceAndDelegate.data.accountByKey) {
      return parseInt(nonceAndDelegate.data.accountByKey.usableNonce);
    } else if(nonceAndDelegate.data.accountByKey.usableNonce===0){
      return 0;
    }
    return customNonce;
  }

  return (
    <Hoc className="main-container">
      <Wallet />
      {renderBanner()}
      <StakeTable
        toggleModal={openModal}
        validators={validators}
        currentDelegate={currentDelegate}
        openCustomDelegateModal={openCustomDelegateModal}
        setOffset={changeOffset}
        page={offset / ITEMS_PER_PAGE + 1}
      />
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
      <ModalContainer show={showModal === ModalStates.NONCE} close={closeNonceModal}>
        <CustomNonce
          proceedHandler={confirmDelegate}
          setCustomNonce={setCustomNonce}
        />
      </ModalContainer>
      <ModalContainer show={showModal === ModalStates.PASSPHRASE} close={closeModal}>
      {isLedgerEnabled ? (
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
      <Alert
        show={showAlert}
        hideToast={() => setShowAlert(false)}
        type={"error-toast"}
      >
        There was an error processing your delegation, please try again later.
      </Alert>
      <Alert
        show={showSuccess}
        hideToast={() => setShowSuccess(false)}
        type={"success-toast"}
      >
        Delegation successfully broadcasted
      </Alert>
    </Hoc>
  );
};
