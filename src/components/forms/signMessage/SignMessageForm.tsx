import { useContext, useEffect, useState } from "react";
import { deriveAccount, getPassphrase } from "../../../tools";
import Button from "../../UI/Button";
import HelpHint from "../../UI/HelpHint";
import Input from "../../UI/input/Input";
import SignMessageResult from "./SignMessageResult";
import { ILedgerContext } from "../../../contexts/ledger/LedgerTypes";
import { LedgerContext } from "../../../contexts/ledger/LedgerContext";
import { IKeypair, IMessageToSign } from "../../../types";
import { toast } from "react-toastify";
import SignMessageLedgerScreen from "../../UI/signMessage/SignMessageLedgerScreen";
import { signed, signMessage } from "@o1labs/client-sdk";
import { Edit3 } from "react-feather";

const SignMessageForm = () => {
  const [message, setMessage] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const storedPassphrase = getPassphrase();
  const [result, setResult] = useState<signed<string>>({
    payload: "",
    signature: {
      scalar: "",
      field: "",
    },
    publicKey: "",
  });

  const { isLedgerEnabled } = useContext<Partial<ILedgerContext>>(
    LedgerContext
  );

  /**
   * If fields are not empty, sign the message and set the result inside the component state
   */
  const submitHandler = async (messageToSign: IMessageToSign) => {
    try {
      const derivedKeypair = await deriveAccount(messageToSign.privateKey);
      const keypair = {
        publicKey: derivedKeypair.publicKey,
        privateKey: derivedKeypair.privateKey,
      } as IKeypair;
      setResult(signMessage(messageToSign.message, keypair));
    } catch (e) {
      toast.error("Please check the passphrase/private key");
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
  };

  /**
   * Clean component state on component dismount
   */
  useEffect(() => {
    return () => {
      setMessage("");
      setPrivateKey("");
    };
  }, []);

  /**
   * Check if message and Passphrase/Private key are not empty
   * @returns boolean
   */
  const signButtonStateHandler = () => {
    return !message || (!privateKey && !storedPassphrase);
  };

  /**
   * Create the object to be signed and sign it
   */
  const createObjectAndSign = () => {
    const messageToSign = {
      message,
      privateKey: privateKey || storedPassphrase,
    };
    submitHandler(messageToSign);
  };

  if (isLedgerEnabled) {
    return <SignMessageLedgerScreen />;
  }

  return (
    <div className="mx-auto mt-2 mb-2">
      <div className="glass-card p-4">
        <div className="animate__animated animate__fadeIn align-left w-75 mx-auto">
          <h2>
            Sign message{" "}
            <HelpHint
              hint={"Cryptographically sign a message with your keypair."}
            />
          </h2>
          <div className="divider w-100" />
          <h5>
            <strong>Message</strong>
          </h5>
          <div
            className="wrap-input1 validate-input"
            data-validate="Name is required"
          >
            <span className="icon" />
            <textarea
              className="selectable-text"
              name="message"
              id="message"
              onChange={(e: any) => setMessage(e.currentTarget.value)}
              value={message}
              placeholder="Message "
            />
          </div>
          {!storedPassphrase && (
            <>
              <h5>
                <strong>Passphrase or Private key</strong>
              </h5>
              <div
                className="wrap-input1 validate-input"
                data-validate="Name is required"
              >
                <span className="icon" />
                <Input
                  name="privateKey"
                  value={privateKey}
                  placeholder="Passphrase or Private key"
                  inputHandler={(e) => setPrivateKey(e.currentTarget.value)}
                  hidden={true}
                  type="text"
                />
              </div>
            </>
          )}
          <div className="fit-content mx-auto">
            <Button
              text="Sign"
              style="primary"
              className="fit-content px-5 mt-4"
              icon={<Edit3 />}
              appendIcon
              onClick={createObjectAndSign}
              disabled={signButtonStateHandler()}
            />
          </div>
          <div>
            {result.payload ? (
              <>
                <div className="divider w-100 mt-4" />
                <SignMessageResult {...result} reset={resetForm} />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignMessageForm;
