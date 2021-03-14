import React, { useState } from "react";
import Hoc from "../components/General/Hoc";
import SignMessageForm from "../components/Forms/SignMessageForm";
import Wallet from "../components/General/Wallet";
import { getAddress } from "../tools";
import * as CodaSDK from "@o1labs/client-sdk";

export default function SignMessage(props) {
  const [message, setMessage] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [result, setResult] = useState(undefined);

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
        const signedMessage = CodaSDK.signMessage(message, keypair);
        setResult(signedMessage);
      }
    } catch (e) {
      props.showGlobalAlert("Please check private key", "error-toast");
    }
  }

  /**
   * Clear form data from state
   */
  function resetForm() {
    setPrivateKey("");
    setResult(undefined);
    setMessage("");
  }

  return (
    <Hoc>
      <Wallet />
      <SignMessageForm
        message={message}
        privateKey={privateKey}
        setMessage={setMessage}
        setPrivateKey={setPrivateKey}
        disableButton={signButtonStateHandler}
        submitHandler={submitHandler}
        result={result}
        reset={resetForm}
      />
    </Hoc>
  );
}
