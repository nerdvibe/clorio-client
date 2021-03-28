import { useState } from "react";
import Hoc from "../components/General/Hoc";
import SignMessageForm from "../components/forms/sign-message/SignMessageForm";
import { derivePublicKey, signMessage } from "@o1labs/client-sdk";
import imageToRender from "../assets/NotAvailableForLedger.svg";
import { toast } from "react-toastify";
import { LedgerContext } from "../context/LedgerContext";
import { useContext } from "react";
import SignMessageResult from "../components/forms/sign-message/SignMessageResult";
import { IMessageToSign } from "../models/message-to-sign";

export default function SignMessage() {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    payload: "",
    signature: {
      scalar: "",
      field: "",
    },
    publicKey: "",
  });
  // TODO : Remove ts-ignore
  // @ts-ignore
  const { isLedgerEnabled } = useContext(LedgerContext);


  /**
   * If fields are not empty, sign message and set result to component state
   */
  const submitHandler = (messageToSign:IMessageToSign) => {
    try {
      const publicKey = derivePublicKey(messageToSign.privateKey)
      const keypair = {
        publicKey,
        privateKey: messageToSign.privateKey,
      };
      setResult(signMessage(messageToSign.message, keypair));
      setShowResult(true);
    } catch (e) {
      toast.error("Please check private key");
    }
  }

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
  }

  if (isLedgerEnabled) {
    return (
      <Hoc>
        <div className="animate__animated animate__fadeIn">
          <div className="mx-auto">
            <div className="block-container">
              <img
                src={imageToRender}
                className="animate__animated animate__fadeIn"
              />
            </div>
          </div>
        </div>
      </Hoc>
    );
  }

  if (showResult) {
    return (
      <Hoc>
        <div className="animate__animated animate__fadeIn">
          <SignMessageResult 
            {...result}
            reset={resetForm}
            />
        </div>
      </Hoc>
    )
  }

  return (
    <Hoc>
      <div className="animate__animated animate__fadeIn">
        <SignMessageForm
          submitHandler={submitHandler}
        />
      </div>
    </Hoc>
  );
}
