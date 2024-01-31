import gql from "graphql-tag";
import { minaNodeClient } from "../minaNodeClient";

export const stats = async () => {
  const { data } = await minaNodeClient.query(
    {
      query: gql`
        query daemonStatus {
          daemonStatus {
            blockchainLength
            syncStatus
            chainId
          }
        }
      `,
      fetchPolicy: 'network-only'
    },
  );

  return {
    blockchainLength: data?.daemonStatus?.blockchainLength || -1,
    syncStatus: data?.daemonStatus?.syncStatus || 'unknown',
    chainId: data?.daemonStatus?.chainId || '',
  }
  return data?.daemonStatus?.blockchainLength || -1;
};
