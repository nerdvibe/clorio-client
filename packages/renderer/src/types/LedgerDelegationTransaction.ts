export interface ILedgerTransaction {
  senderAccount: number;
  senderAddress: string;
  receiverAddress: string;
  fee: number;
  amount: number;
  memo?: string;
  nonce: number;
  // TODO: FIX any type!
  txType: any;
  // TODO: FIX any type!
  networkId: any;
  validUntil: number;
}
