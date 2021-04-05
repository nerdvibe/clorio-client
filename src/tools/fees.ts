import { DEFAULT_FEE } from "./const";

/**
 * if a fee is 0, returns the default fee
 * @param fee
 * @returns {string}
 */
export const feeOrDefault = (fee?: number) => {
  if (!fee) {
    return DEFAULT_FEE;
  }
  return +fee > 0 ? +fee : DEFAULT_FEE;
};
