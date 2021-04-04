import React, { useState } from "react";
import NewsBanner from "../../components/UI/NewsBanner";
import StakeTable from "../../components/stake/stakeTable/StakeTable";
import Hoc from "../../components/UI/Hoc";
import ModalContainer from "../../components/modals/ModalContainer";
import { useQuery, useMutation } from "@apollo/client";
import { isEmptyObject, readSession } from "../../tools";
import { useEffect } from "react";
import PrivateKeyModal from "../../components/modals/PrivateKeyModal";
import { useHistory } from "react-router-dom";
import ConfirmDelegation from "../../components/modals/ConfirmDelegation";
import CustomDelegation from "../../components/modals/CustomDelegation";
import DelegationFee from "../../components/modals/DelegationFee";
import {
  createLedgerDelegationTransaction,
  isMinaAppOpen,
  signTransaction,
} from "../../tools/ledger/ledger";
import { getDefaultValidUntilField, toNanoMINA } from "../../tools";
import LedgerLoader from "../../components/UI/LedgerLoader";
import CustomNonce from "../../components/modals/CustomNonce";
import Button from "../../components/UI/Button";
import { DEFAULT_INTERVAL, ITEMS_PER_PAGE, MINIMUM_FEE, MINIMUM_NONCE } from "../../tools/const";
import {
  BROADCAST_DELEGATION,
  GET_VALIDATORS,
  GET_AVERAGE_FEE,
  GET_VALIDATORS_NEWS,
  GET_NONCE_AND_DELEGATE,
} from "../../graphql/query";
import {
  createDelegationPaymentInputFromPayload,
  createSignatureInputFromSignature,
} from "../../tools/transactions";
import { derivePublicKey, signStakeDelegation } from "@o1labs/client-sdk";
import { feeOrDefault } from "../../tools/fees";
import { toast } from "react-toastify";
import { LedgerContext } from "../../context/ledger/LedgerContext";
import { useContext } from "react";
import { BalanceContext } from "../../context/balance/BalanceContext";
import Big from "big.js";
import { initialDelegateData, ModalStates } from "./StakeHelper";
import { IValidatorData } from "../../components/stake/stakeTableRow/ValidatorDataInterface";
import { IWalletData } from "../../models/WalletData";

interface IProps {
  sessionData:IWalletData
}

export default ({sessionData}:IProps) => {
  const [delegateData, setDelegate] = useState<IValidatorData>(initialDelegateData);
  const [currentDelegate, setCurrentDelegate] = useState("");
  const [currentDelegateName, setCurrentDelegateName] = useState("");
  const [showModal, setShowModal] = useState("");
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [customDelegate, setCustomDelegate] = useState("");
  const [offset, setOffset] = useState(0);
  const [customNonce, setCustomNonce] = useState(MINIMUM_NONCE);
  const [selectedFee, setSelectedFee] = useState(toNanoMINA(MINIMUM_FEE));
  const [sendTransactionFlag, setSendTransactionFlag] = useState(false);
  const { isLedgerEnabled }:any = useContext(LedgerContext);
  const { balance, setShouldBalanceUpdate }:any = useContext(BalanceContext);
  const {
    data: validatorsData,
    error: validatorsError,
    loading: validatorsLoading,
  } = useQuery(GET_VALIDATORS, { variables: { offset } });
  const fee = useQuery(GET_AVERAGE_FEE);
  const news = useQuery(GET_VALIDATORS_NEWS);
  const nonceAndDelegate = useQuery(GET_NONCE_AND_DELEGATE, {
    variables: { publicKey: sessionData.address },
    fetchPolicy: "network-only",
    pollInterval: DEFAULT_INTERVAL,
  });
  const history = useHistory();
  const [ledgerTransactionData, setLedgerTransactionData] = useState(undefined);
  const latestNews = news.data?.news_validators.length > 0 ? news.data?.news_validators[0] : {};
  const [broadcastDelegation] = useMutation(BROADCAST_DELEGATION, {
    onError: (error) => {
      toast.error(error.message);
      return clearState();
    },
  });

  useEffect(() => {
    if(address===""){
      getAndSetAddress()
    }
  })

  // TODO : Example - To be removed
  // const readNetworkFromStorage = async () => {
  //   const networkData = await readNetworkData();
  //   console.log(
  //     "🚀 ~ file: Stake.js ~ line 120 ~ readNetworkFromStorage ~ networkData",
  //     networkData
  //   );
  // };

  // useEffect(() => {
  //   readNetworkFromStorage();
  // }, []);

  useEffect(() => {
    if (nonceAndDelegate.data?.accountByKey?.delegate?.publicKey) {
      setCurrentDelegate(
        nonceAndDelegate.data?.accountByKey.delegate.publicKey
      );
      setCurrentDelegateName(nonceAndDelegate.data.accountByKey.delegate.name);
    }
  }, [nonceAndDelegate.data]);

  useEffect(() => {
    if (isLedgerEnabled && !ledgerTransactionData) {
      if (showModal === ModalStates.PASSPHRASE) {
        const transactionListener = signLedgerTransaction();
        // @ts-ignore
        return transactionListener.unsubscribe;
      }
    }
  }, [ledgerTransactionData, showModal]);

  useEffect(() => {
    if (sendTransactionFlag) {
      clearState();
      setShouldBalanceUpdate(true);
      nonceAndDelegate.refetch({ publicKey: sessionData.address });
      toast.success("Delegation successfully broadcasted");
      history.push("/stake");
    }
    broadcastLedgerTransaction()
  }, [sendTransactionFlag]);

  // Get sender public key
  const getAndSetAddress = async () => {
    const walletAddress = await readSession();
    setAddress(walletAddress.address);
  }

  const broadcastLedgerTransaction = () => {
    try{
      if (ledgerTransactionData && !sendTransactionFlag) {
        const actualNonce = getNonce();
        const publicKey = delegateData?.publicKey;
        const SignatureInput = {rawSignature: ledgerTransactionData};
        const SendPaymentInput = {
          nonce: actualNonce.toString(),
          memo: "",
          fee: selectedFee.toString(),
          to: publicKey,
          from: address,
          validUntil: getDefaultValidUntilField(),
        };
        broadcastDelegation({
          variables: { input: SendPaymentInput, signature: SignatureInput },
        });
        setSendTransactionFlag(true);
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  /**
   * Throw error if the fee is greater than the balance
   * @param {number} transactionFee
   */
  const checkBalance = (transactionFee:number) => {
    const available = balance.liquidUnconfirmed;
    const balanceAfterTransaction = Big(available)
      .minus(transactionFee)
      .toNumber();
    if (balanceAfterTransaction < 0) {
      throw new Error("You don't have enough funds");
    }
  };

  /**
   * Sign stake delegation using Coda SDK through private key
   */
  function signStakeDelegate() {
    try {
      if (!delegateData?.publicKey || delegateData.publicKey === "") {
        throw new Error("The Public key of the selected delegate is missing");
      }
      const actualNonce = getNonce();
      checkBalance(selectedFee);
      const publicKey = derivePublicKey(privateKey);
      const keypair = {
        privateKey: privateKey,
        publicKey: publicKey,
      };
      const stakeDelegation = {
        to: delegateData.publicKey,
        from: address,
        fee: selectedFee,
        nonce: actualNonce,
      };
      const signStake = signStakeDelegation(stakeDelegation, keypair);
      if (signStake) {
        const SignatureInput = createSignatureInputFromSignature(
          signStake.signature
        );
        const SendPaymentInput = createDelegationPaymentInputFromPayload(
          signStake.payload
        );
        broadcastDelegation({
          variables: {
            input: SendPaymentInput,
            signature: SignatureInput,
          },
        });
        setSendTransactionFlag(true);
        setShowModal("");
      }
    } catch (e) {
      toast.error(
        e.message ||
          "There was an error processing your delegation, please try again later."
      );
    }
  }

  /**
   * Set delegate private key on component state, open confirmation modal
   * @param {string} delegate Delegate private key
   */
  function openModal(delegate:IValidatorData) {
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
    setCustomNonce(MINIMUM_NONCE);
    setCustomDelegate("");
  }

  /**
   * If nonce is not available and no custom nonce has already been asked, ask user for a custom nonce. Otherwise proceeds to private key insertion modal
   */
  function confirmDelegate() {
    try {
      if ((!nonceAndDelegate || !nonceAndDelegate.data) && !customNonce) {
        setShowModal(ModalStates.NONCE);
      } else if (customDelegate) {
        nonceAndDelegate.refetch({ publicKey: sessionData.address });
        setShowModal(ModalStates.FEE);
        setDelegate({ publicKey: customDelegate });
      } else {
        nonceAndDelegate.refetch({ publicKey: sessionData.address });
        setShowModal(ModalStates.FEE);
      }
    } catch (e) {
      setShowModal(ModalStates.FEE);
    }
  }

  /**
   * User confirmed delegate public key, proceeds to private key insertion
   * @param {string} delegate Delegate private key
   */
  function confirmCustomDelegate(delegate:string) {
    try {
      nonceAndDelegate.refetch({ publicKey: sessionData.address });
      setShowModal(ModalStates.FEE);
      setDelegate({ publicKey: delegate });
    } catch (e) {
      setShowModal(ModalStates.FEE);
    }
  }

  /**
   * Close all modals, clears custom nonce state
   */
  function closeNonceModal() {
    setShowModal("");
    setCustomNonce(MINIMUM_NONCE);
  }

  /**
   * Clear component state
   */
  function clearState() {
    setShowModal("");
    setDelegate(initialDelegateData);
    setSendTransactionFlag(false);
    setCustomNonce(MINIMUM_NONCE);
    setPrivateKey("")
    setCustomDelegate("");
    setLedgerTransactionData(undefined);
    setSelectedFee(feeOrDefault());
  }

  /**
   * Set query offset based on selected page
   * @param {number} page Page number
   */
  function changeOffset(page:number) {
    const data = (page - 1) * ITEMS_PER_PAGE;
    setOffset(data);
  }

  const setFee = (value:number) => {
    setSelectedFee(value);
    setShowModal(ModalStates.PASSPHRASE);
  };

  /**
   * Sign delegation through ledger and store the result inside the component state
   * @param {function} callback Callback function called after ledger signed Delegation
   */
  const signLedgerTransaction = async () => {
    try {
      if (!delegateData || delegateData?.publicKey) {
        throw new Error("Recipient Public key is not defined");
      }
      await isMinaAppOpen();
      checkBalance(selectedFee);
      const actualNonce = getNonce();
      const senderAccount = sessionData?.ledgerAccount || 0;
      const receiverAddress = delegateData?.publicKey;
      const transactionToSend = createLedgerDelegationTransaction({
        senderAccount,
        senderAddress:address,
        receiverAddress,
        fee:+selectedFee,
        nonce:actualNonce
      });
      const signature = await signTransaction(transactionToSend);
      setShowModal(ModalStates.BROADCASTING);
      setLedgerTransactionData(signature.signature);
    } catch (e) {
      toast.error(
        e.message || "An error occurred while loading hardware wallet"
      );
      setShowModal("");
    }
  };

  /**
   * If nonce is available from query, returns it, otherwise custom nonce is returned
   * @returns number Nonce number
   */
  function getNonce() {
    if (nonceAndDelegate.data?.accountByKey?.usableNonce) {
      return parseInt(nonceAndDelegate.data.accountByKey.usableNonce);
    } else if (nonceAndDelegate.data?.accountByKey?.usableNonce === 0) {
      return 0;
    }
    return customNonce;
  }

  return (
    <Hoc className="main-container">
      <div className="animate__animated animate__fadeIn">
        <NewsBanner {...latestNews} />
        <StakeTable
          toggleModal={openModal}
          validators={validatorsData?.validators}
          loading={validatorsLoading}
          error={validatorsError}
          currentDelegate={currentDelegate}
          currentDelegateName={currentDelegateName}
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
          name={delegateData?.name}
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
      <ModalContainer show={showModal === ModalStates.FEE} close={closeModal}>
        <DelegationFee
          closeModal={closeModal}
          fees={fee?.data}
          proceedHandler={setFee}
        />
      </ModalContainer>
    </Hoc>
  );
};
