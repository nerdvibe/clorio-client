import { uint32, uint64 } from "@o1labs/client-sdk/src/TSTypes";

export interface ITransactionPayload{
  nonce: uint32,
  memo?: string,
  fee: uint64,
  amount?: uint64,
  to: string,
  from: string,
  validUntil?: uint32
}
