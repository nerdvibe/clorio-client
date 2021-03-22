import React from "react";
import { useState } from "react";
import Hoc from "../components/General/Hoc";
import VerifyForm from "../components/Forms/VerifyMessageForm";
import * as CodaSDK from "@o1labs/client-sdk";
import { toast } from 'react-toastify';

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
  function verifyMessage() {
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
        const verifiedMessage = CodaSDK.verifyMessage(signedMessage);
        if (verifiedMessage) {
          toast.success("Message is valid");
        } else {
          toast.error("Message is not valid");
        }
      }
    } catch (e) {
      toast.error("Message is not valid");
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
        verifyMessage={verifyMessage}
        disableButton={disableButton}
      />
    </Hoc>
  );
}
