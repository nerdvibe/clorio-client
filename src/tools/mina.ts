import Big from "big.js";

export const toNanoMINA = (amount: number | string) => {
  return +Big(amount).mul(1e9).toFixed();
};

export const toMINA = (amount: number | string) => {
  return +Big(amount).mul(1e-9).toFixed(3);
};

export const toLongMINA = (amount: number | string) => {
  return Big(amount).mul(1e-9).toFixed();
};
