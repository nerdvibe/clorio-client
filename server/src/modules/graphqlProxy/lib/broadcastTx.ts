import gql from "graphql-tag";
import { minaNodeClient } from "../minaNodeClient";
import {
  SendPaymentInput,
  SignatureInput,
} from "@modules/transactions/graphql/mutations";

export const reEncodeRawSignature = (rawSignature) => {
  function shuffleBytes(hex) {
    let bytes = hex.match(/.{2}/g);
    bytes.reverse();
    return bytes.join("");
  }

  if (rawSignature.length !== 128) {
    throw "Invalid raw signature input";
  }
  const field = rawSignature.substring(0, 64);
  const scalar = rawSignature.substring(64);
  return shuffleBytes(field) + shuffleBytes(scalar);
};

export const broadcastTx = async (
  signature: SignatureInput,
  input: SendPaymentInput
) => {
  if (signature.rawSignature) {
    signature.rawSignature = reEncodeRawSignature(signature.rawSignature);
  }

  const { data, errors } = await minaNodeClient.mutate({
    mutation: gql`
      mutation sendPayment(
        $signature: SignatureInput
        $input: SendPaymentInput!
      ) {
        sendPayment(signature: $signature, input: $input) {
          payment {
            id
          }
        }
      }
    `,
    variables: {
      signature,
      input,
    },
  });

  if (errors || !data?.sendPayment?.payment?.id) {
    throw new Error("Broadcast failed");
  }

  return data.sendPayment.payment;
};
