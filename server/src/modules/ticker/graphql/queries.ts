import { tickerCacheGet } from "@modules/cache";
import {sendGraphqlError} from "../../../graphql/util";

export const queries = {
  ticker: () => {
    try {
      return tickerCacheGet();
    } catch(e) {
      sendGraphqlError(e)
    }
  },
};
