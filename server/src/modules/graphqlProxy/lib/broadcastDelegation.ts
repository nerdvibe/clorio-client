import gql from "graphql-tag";
import { minaNodeClient } from "../minaNodeClient";
import {
  SendDeleagationInput,
  SignatureInput,
} from "@modules/transactions/graphql/mutations";
import { reEncodeRawSignature } from "./broadcastTx";

export const broadcastDelegation = async (
  signature: SignatureInput,
  input: SendDeleagationInput
) => {
  if (signature.rawSignature) {
    signature.rawSignature = reEncodeRawSignature(signature.rawSignature);
  }

  const { data, errors } = await minaNodeClient.mutate({
    mutation: gql`
      mutation sendDelegation(
        $signature: SignatureInput
        $input: SendDelegationInput!
      ) {
        sendDelegation(signature: $signature, input: $input) {
          delegation {
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

  if (errors) {
    throw errors;
  }

  if (!data?.sendDelegation?.delegation?.id) {
    throw new Error("Broadcast failed");
  }

  return data.sendDelegation.delegation;
};
