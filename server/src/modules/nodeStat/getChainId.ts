import { chainIdCacheGet } from "@modules/cache/chainId";

export const getChainId = () => {
  return chainIdCacheGet();
};
