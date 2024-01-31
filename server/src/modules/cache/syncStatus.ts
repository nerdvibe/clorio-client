import NodeCache from "node-cache";

const syncStatusCache = new NodeCache();
syncStatusCache.set("syncStatus", 'unknown');

export const syncStatusCacheSet = (syncStatus: string) => {
    syncStatusCache.set("syncStatus", syncStatus)
}

export const syncStatusCacheGet = ():string => {
    return syncStatusCache.get("syncStatus")
}
