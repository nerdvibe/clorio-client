import { Big, BigSource } from 'big.js';
import { NANOMINA } from "../";

export const fromNanoToMina = (amount: BigSource) => +amount === 0 ? +amount : +Big(amount).div(NANOMINA).round(8)
