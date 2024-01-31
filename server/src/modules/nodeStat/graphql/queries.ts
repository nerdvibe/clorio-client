import {getHeight} from "@modules/nodeStat";
import {sendGraphqlError} from "../../../graphql/util";
import { getChainId } from "../getChainId";
import { getSyncStatus } from "../getSyncStatus";

export const queries = {
  nodeInfo: async () => {
    try {
      const height = getHeight();
      const syncStatus = getSyncStatus();
      const chainId = getChainId();
      const name = process.env.SERVER_NAME
      const version = process.env.SERVER_VERSION
      const network = process.env.NETWORK
      return {
        height,
        name,
        syncStatus,
        chainId,
        version,
        network
      };
    } catch(e) {
      sendGraphqlError(e)
    }
  },
};
