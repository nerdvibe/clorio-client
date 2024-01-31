import { Big, BigSource } from 'big.js';
import { NANOMINA } from "../";

export const fromMinaToNano = (amount: BigSource) => +Big(amount).mul(NANOMINA).round(8)
