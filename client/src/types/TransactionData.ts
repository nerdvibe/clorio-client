export interface ITransactionData {
  senderAddress: string;
  amount: number;
  receiverAddress: string;
  fee: number;
  nonce: number;
  memo?: string;
}
