import { useState } from "react";
import Hoc from "../../components/UI/Hoc";
import SignMessageForm from "../../components/forms/signMessage/SignMessageForm";
import { derivePublicKey, signed, signMessage } from "@o1labs/client-sdk";
import { toast } from "react-toastify";
import { ILedgerContext } from "../../contexts/ledger/LedgerTypes";
import { LedgerContext } from "../../contexts/ledger/LedgerContext";
import { useContext } from "react";
import { IMessageToSign } from "../../types/MessageToSign";
import SignatureMessageResult from "../../components/UI/sigmMessage/SignatureMessageResult";
import SignMessageLedgerScreen from "../../components/UI/sigmMessage/SignMessageLedgerScreen";

const SignMessage = () => {
  const [showResult, setShowResult] = useState<boolean>(false);
  const [result, setResult] = useState<signed<string>>({
    payload: "",
    signature: {
      scalar: "",
      field: "",
    },
    publicKey: "",
  });
  const { isLedgerEnabled } = useContext<Partial<ILedgerContext>>(
    LedgerContext,
  );

  /**
   * If fields are not empty, sign the message and set the result inside the component state
   */
  const submitHandler = (messageToSign: IMessageToSign) => {
    try {
      const publicKey = derivePublicKey(messageToSign.privateKey);
      const keypair = {
        publicKey,
        privateKey: messageToSign.privateKey,
      };
      setResult(signMessage(messageToSign.message, keypair));
      setShowResult(true);
    } catch (e) {
      toast.error("Please check private key");
    }
  };

  /**
   * Clear form data from state
   */
  const resetForm = () => {
    setResult({
      payload: "",
      signature: {
        scalar: "",
        field: "",
      },
      publicKey: "",
    });
    setShowResult(false);
  };

  if (isLedgerEnabled) {
    return <SignMessageLedgerScreen />;
  }

  if (showResult) {
    return <SignatureMessageResult result={result} resetForm={resetForm} />;
  }

  return (
    <Hoc>
      <div className="animate__animated animate__fadeIn">
        <SignMessageForm submitHandler={submitHandler} />
      </div>
    </Hoc>
  );
};

export default SignMessage;
