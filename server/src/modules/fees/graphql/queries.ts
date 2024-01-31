import {feesCacheGet} from "@modules/cache";
import {sendGraphqlError} from "../../../graphql/util";

export const queries = {
  estimatedFee: () => {
    try {
      return feesCacheGet();
    } catch(e) {
      sendGraphqlError(e)
    }
  },
};
