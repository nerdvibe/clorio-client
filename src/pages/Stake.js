import React, { useState } from "react";
import StakeTable from "../components/StakeTable";
import Wallet from "../components/Wallet";
import Button from "../components/Button";
import Hoc from "../components/Hoc";
import Modal from "../components/Modal";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Row, Col } from "react-bootstrap";
import { getAddress } from "../tools";
import { useEffect } from "react";
import * as CodaSDK from "@o1labs/client-sdk";
import PrivateKeyModal from "../components/PrivateKeyModal";
import Alert from "../components/General/Alert";
import Input from "../components/Input";
import { useHistory } from "react-router-dom";
import ledger from "../tools/ledger";
import { getDefaultValidUntilField, toNanoMINA } from "../tools/utils";
import LedgerLoader from "../components/LedgerLoader";
import CustomNonce from "../components/CustomNonce";
import Banner from "../components/Banner";

const ITEMS_PER_PAGE = 10;

const VALIDATORS = gql`
  query validators($offset: Int!) {
    validators(limit: 10, offset: $offset) {
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

const GET_VALIDATORS_TOTAL = gql`
  query CountValidators {
    validators_aggregate {
      aggregate {
        count
      }
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
  const [broadcastDelegation, broadcastResult] = useMutation(
    BROADCAST_DELEGATION,
    {
      onError: (error) => {
        props.showGlobalAlert(error.message);
        return clearState();
      },
    }
  );
  const total = useQuery(GET_VALIDATORS_TOTAL);
  const history = useHistory();
  const [ledgerTransactionData, setLedgerTransactionData] = useState(undefined);

  useEffect(() => {
    if (
      nonceAndDelegate.data &&
      nonceAndDelegate.data.accountByKey &&
      nonceAndDelegate.data.accountByKey.delegate
    ) {
      setCurrentDelegate(nonceAndDelegate.data.accountByKey.delegate.publicKey);
    }
  }, [nonceAndDelegate.data]);

  getAddress((address) => {
    setAddress(address);
  });

  if (!showSuccess && broadcastResult && broadcastResult.data) {
    clearState();
    setShowSuccess(true);
    history.push("/stake");
  }

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
        total={getTotalPages()}
      />
      <Modal
        show={showModal === ModalStates.CONFIRM_DELEGATION}
        close={closeModal}
      >
        {renderModal()}
      </Modal>
      <Modal show={showModal === ModalStates.NONCE} close={closeNonceModal}>
        <CustomNonce
          proceedHandler={confirmDelegate}
          setCustomNonce={setCustomNonce}
        />
      </Modal>
      <Modal show={showModal === ModalStates.PASSPHRASE} close={closeModal}>
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
      </Modal>
      <Modal
        show={showModal === ModalStates.CUSTOM_DELEGATION}
        close={closeModal}
      >
        {renderCustomDelegationForm()}
      </Modal>
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

  function closeNonceModal() {
    setShowModal("");
    setCustomNonce(undefined);
  }

  function renderModal() {
    const delegateToShow = delegateData ? delegateData.name : customDelegate;
    return (
      <div className="mx-auto">
        <h2>Confirm Delegation</h2>
        <div className="v-spacer" />
        <h5 className="align-center mx-auto">
          Are you sure you want to <br />
          delegate this stake to <strong>{delegateToShow}</strong>
        </h5>
        <div className="v-spacer" />
        <Row>
          <Col xs={6}>
            <Button
              onClick={closeModal}
              className="link-button"
              text="Cancel"
            />
          </Col>
          <Col xs={6}>
            <Button
              onClick={confirmDelegate}
              className="lightGreenButton__fullMono mx-auto"
              text="Confirm"
            />
          </Col>
        </Row>
      </div>
    );
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

  function renderCustomDelegationForm() {
    return (
      <div className="mx-auto">
        <h2>Custom delegation</h2>
        <div className="v-spacer" />
        <h6 className="full-width">Insert Public key</h6>
        <div className="v-spacer" />
        <Input
          inputHandler={(e) => {
            setCustomDelegate(e.currentTarget.value);
          }}
          placeholder="Insert public key"
        />
        <div className="v-spacer" />
        <Row>
          <Col xs={6}>
            <Button
              onClick={closeModal}
              className="link-button"
              text="Cancel"
            />
          </Col>
          <Col xs={6}>
            <Button
              onClick={confirmDelegate}
              className="lightGreenButton__fullMono mx-auto"
              text="Confirm"
              disabled={customDelegate === ""}
            />
          </Col>
        </Row>
      </div>
    );
  }

  function clearState() {
    setShowModal("");
    setDelegate({});
    setCustomNonce(undefined);
    setCustomDelegate("");
    setLedgerTransactionData(undefined);
  }

  function getTotalPages() {
    if (total.data && total.data.validators_aggregate) {
      const totalItems = total.data.validators_aggregate.aggregate.count;
      const pages = (totalItems / ITEMS_PER_PAGE).toFixed(0);
      if (parseInt(pages) === 0) {
        return 1;
      }
      return pages;
    }
    return 1;
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
    }
    return customNonce;
  }
};
