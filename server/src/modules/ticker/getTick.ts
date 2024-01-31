import { tickerCacheGet } from "../cache";

export const getTick = () => {
  return tickerCacheGet();
};
