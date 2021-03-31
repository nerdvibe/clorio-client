import Hoc from "../components/general/Hoc";
import VerifyForm from "../components/forms/verify-message/VerifyMessageForm";
import { verifyMessage } from "@o1labs/client-sdk";
import { toast } from "react-toastify";
import {IMessageToVerify} from "../models/message-to-verify";

export default function VerifyMessage() {
  /**
   * Using CodaSDK check if input message is valid
   */
  const verifySignedMessage = (messageToVerify:IMessageToVerify) => {
    const {address,message,field,scalar} = messageToVerify;
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
          toast.success("Message is valid");
        } else {
          toast.error("Message is not valid");
        }
      }
    } catch (e) {
      toast.error("Message is not valid");
    }
  }

  return (
    <Hoc>
      <VerifyForm
        verifyMessage={verifySignedMessage}
      />
    </Hoc>
  );
}
