import React from "react";
import { useState } from "react";
import Alert from "../components/General/Alert";
import Hoc from "../components/General/Hoc";
import VerifyForm from "../components/Forms/VerifyMessageForm";
import Wallet from "../components/General/Wallet";
import * as CodaSDK from "@o1labs/client-sdk";

export default function VerifyMessage() {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [field, setField] = useState("");
  const [scalar, setScalar] = useState("");
  const [show, setShow] = useState(undefined);

  function handleInput(text) {
    setMessage(text);
  }

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
          setShow("success");
        } else {
          setShow("error");
        }
      }
    } catch (e) {
      setShow("error");
    }
  }

  function disableButton() {
    return address === "" || message === "" || field === "" || scalar === "";
  }
  
  return (
    <Hoc>
      <Wallet />
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
      <Alert
        show={show === "success"}
        hideToast={() => setShow(undefined)}
        type={"success-toast"}
      >
        Message is valid
      </Alert>
      <Alert
        show={show === "error"}
        hideToast={() => setShow(undefined)}
        type={"error-toast"}
      >
        Message is not valid
      </Alert>
    </Hoc>
  );
}
