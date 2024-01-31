import { feesCacheSet } from "../cache";
import { logger } from "@modules/log";
import {fees as feesQuery} from "@modules/graphqlProxy/lib/fees";

const log = logger("FEES_SET_FEES");

export const setFee = async () => {
  try {
    const fees = await feesQuery();

    feesCacheSet(fees);
  } catch (e) {
    log.error("cache fees update failed", e);
  }
};
