import gql from "graphql-tag";
import { minaNodeClient } from "../minaNodeClient";

export const mempool = async (publicKey: string) => {
  const { data } = await minaNodeClient.query({
    query: gql`
      query mempool($publicKey: String) {
        pooledUserCommands(publicKey: $publicKey) {
          id
          fee
          feeToken
          kind
          amount
          nonce
          source {
            publicKey
          }
          receiver {
            publicKey
          }
        }
      }
    `,
    variables: {
      publicKey,
    },
    fetchPolicy: "no-cache",
  });

  return data.pooledUserCommands || [];
};
