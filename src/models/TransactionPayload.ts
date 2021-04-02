export interface ITransactionPayload{
  nonce: number,
  memo?: string,
  fee: number,
  amount: number,
  to: string,
  from: string,
  validUntil?: number,
}
