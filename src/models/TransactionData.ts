export interface ITransactionData {
  amount: number,
  receiverAddress: string,
  fee: number,
  nonce: number,
  memo?: string,
}
