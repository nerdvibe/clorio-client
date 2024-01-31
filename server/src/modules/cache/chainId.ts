import NodeCache from "node-cache";

const chainIdCache = new NodeCache();
chainIdCache.set("chainId", 'unknown');

export const chainIdCacheSet = (chainId: string) => {
    chainIdCache.set("chainId", chainId)
}

export const chainIdCacheGet = ():string => {
    return chainIdCache.get("chainId")
}
