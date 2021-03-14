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
  });
  const [delegateData, setDelegate] = useState({});
  const [currentDelegate, setCurrentDelegate] = useState("");
  const [showModal, setshowModal] = useState("");
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [customDelegate, setCustomDelegate] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [offset, setOffset] = useState(0);
  const validators = useQuery(VALIDATORS, { variables: { offset } });
  const fee = useQuery(GET_FEE);
  const news = useQuery(NEWS);
  const nonceAndDelegate = useQuery(GET_NONCE_AND_DELEGATE, {
    variables: { publicKey: props.sessionData.address },
    skip: props.sessionData.address === "",
  });
  const [broadcastDelegation, broadcastResult] = useMutation(
    BROADCAST_DELEGATION
  );
  const history = useHistory();

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

  function signStakeDelegate() {
    try {
      const actualNonce = nonceAndDelegate.data
        ? parseInt(nonceAndDelegate.data.accountByKey.usableNonce)
        : 0;
      const publicKey = CodaSDK.derivePublicKey(privateKey);
      const keypair = {
        privateKey: privateKey,
        publicKey: publicKey,
      };
      const stakeDelegation = {
        to: delegateData.publicKey,
        from: address,
        fee: +fee.data.estimatedFee.average * 1000000000,
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
        setshowModal("");
      }
    } catch (e) {
      setShowAlert(true);
    }
  }

  function openModal(delegate) {
    setDelegate(delegate);
    setshowModal(ModalStates.CONFIRM_DELEGATION);
  }

  function openCustomDelegateModal() {
    setshowModal(ModalStates.CUSTOM_DELEGATION);
  }

  function closeModal() {
    setshowModal("");
  }

  function confirmDelegate() {
    nonceAndDelegate.refetch({ publicKey: props.sessionData.address });
    setshowModal(ModalStates.PASSPHRASE);
  }

  function confirmCustomDelegate(delegate) {
    nonceAndDelegate.refetch({ publicKey: props.sessionData.address });
    setshowModal(ModalStates.PASSPHRASE);
    setDelegate({ publicKey: delegate });
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
    setshowModal("");
    setDelegate({});
    setCustomDelegate("");
  }

  function changeOffset(page) {
    const data = (page - 1) * ITEMS_PER_PAGE;
    setOffset(data);
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
      <ModalContainer show={showModal === ModalStates.PASSPHRASE} close={closeModal}>
        <PrivateKeyModal
          confirmPrivateKey={signStakeDelegate}
          closeModal={closeModal}
          setPrivateKey={setPrivateKey}
          subtitle={
            customDelegate && `You are going to delegate ${customDelegate}`
          }
        />
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
