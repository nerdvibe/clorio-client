import { feesCacheGet } from "../cache";

export const getFee = () => {
  return feesCacheGet();
};
