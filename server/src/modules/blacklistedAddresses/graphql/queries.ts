import {blacklistedAddressesGet} from "@modules/cache";
import {sendGraphqlError} from "../../../graphql/util";

export const queries = {
  blacklistedAddresses: () => {
    try {
      return blacklistedAddressesGet();
    } catch(e) {
      sendGraphqlError(e)
    }
  },
};
