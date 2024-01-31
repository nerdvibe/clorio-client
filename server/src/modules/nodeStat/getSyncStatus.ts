import { syncStatusCacheGet } from "@modules/cache/syncStatus";

export const getSyncStatus = () => {
  return syncStatusCacheGet();
};
