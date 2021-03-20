import React from "react";
import { useState } from "react";
import Hoc from "../components/General/Hoc";
import VerifyForm from "../components/Forms/VerifyMessageForm";
import { verifyMessage } from "@o1labs/client-sdk";

export default function VerifyMessage(props) {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [field, setField] = useState("");
  const [scalar, setScalar] = useState("");

  /**
   * Set input text inside me
   * @param {string} text Message to verify
   */
  function handleInput(text) {
    setMessage(text);
  }

  /**
   * Using CodaSDK check if input message is valid
   */
  function verifySignedMessage() {
    try {
      if (message && message !== "") {
        const signedMessage = {
          publicKey: address,
          payload: message,
          signature: {
            field,
            scalar,
          },
        };
        if (verifyMessage(signedMessage)) {
          props.showGlobalAlert("Message is valid", "success-toast");
        } else {
          props.showGlobalAlert("Message is not valid", "error-toast");
        }
      }
    } catch (e) {
      props.showGlobalAlert("Message is not valid", "error-toast");
    }
  }

  /**
   * If one between address,message,field or scalar is empty button is disabled
   * @returns boolean
   */
  function disableButton() {
    return address === "" || message === "" || field === "" || scalar === "";
  }

  return (
    <Hoc>
      <VerifyForm
        address={address}
        setAddress={setAddress}
        message={message}
        setMessage={setMessage}
        field={field}
        setField={setField}
        scalar={scalar}
        setScalar={setScalar}
        handleInput={handleInput}
        verifyMessage={verifySignedMessage}
        disableButton={disableButton}
      />
    </Hoc>
  );
}
