const DEFAULT_FEE = "0.1";

/**
 * if a fee is 0, returns the default fee
 * @param fee
 * @returns {string}
 */
export const feeOrDefault = (fee) => {
  if(!fee) {
    return DEFAULT_FEE
  }
  return +fee > 0 ? fee : DEFAULT_FEE
}
