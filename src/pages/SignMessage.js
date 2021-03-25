import React, { useState } from "react";
import Hoc from "../components/General/Hoc";
import SignMessageForm from "../components/Forms/SignMessageForm";
import { getAddress } from "../tools";
import { signMessage } from "@o1labs/client-sdk";
import imageToRender from "../assets/NotAvailableForLedger.svg";
import { toast } from "react-toastify";
import { LedgerContext } from "../context/LedgerContext";
import { useContext } from "react";

export default function SignMessage() {
  const [message, setMessage] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    payload: "",
    signature: {
      scalar: "",
      field: "",
    },
    publicKey: "",
  });
  const { isLedgerEnabled } = useContext(LedgerContext);

  getAddress((data) => {
    setPublicKey(data);
  });

  /**
   * Check if message, private key and public key are not empty
   * @returns boolean
   */
  function signButtonStateHandler() {
    const checkCondition =
      message === "" || privateKey === "" || publicKey === "";
    return checkCondition;
  }

  /**
   * If fields are not empty, sign message and set result to component state
   */
  function submitHandler() {
    try {
      if (!signButtonStateHandler()) {
        const keypair = {
          publicKey,
          privateKey,
        };
        setResult(signMessage(message, keypair));
        setShowResult(true);
      }
    } catch (e) {
      toast.error("Please check private key");
    }
  }

  /**
   * Clear form data from state
   */
  function resetForm() {
    setPrivateKey("");
    setResult({
      payload: "",
      signature: {
        scalar: "",
        field: "",
      },
      publicKey: "",
    });
    setMessage("");
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

  return (
    <Hoc>
      <div className="animate__animated animate__fadeIn">
        <SignMessageForm
          message={message}
          privateKey={privateKey}
          setMessage={setMessage}
          setPrivateKey={setPrivateKey}
          disableButton={signButtonStateHandler}
          submitHandler={submitHandler}
          result={result}
          showResult={showResult}
          reset={resetForm}
        />
      </div>
    </Hoc>
  );
}
