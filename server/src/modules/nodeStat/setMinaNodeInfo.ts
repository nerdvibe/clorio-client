import { heightCacheSet } from "../cache";
import { logger } from "@modules/log";
import { stats as statsQuery } from "@modules/graphqlProxy/";
import { syncStatusCacheSet } from "@modules/cache/syncStatus";
import { chainIdCacheSet } from "@modules/cache/chainId";

const log = logger("HEIGHT_SET_HEIGHT");

export const setMinaNodeInfo = async () => {
  try {
    const info = await statsQuery();

    heightCacheSet(info.height);
    syncStatusCacheSet(info.syncStatus);
    chainIdCacheSet(info.chainId);
  } catch (e) {
    log.error("cache height update failed", e);
  }
};
