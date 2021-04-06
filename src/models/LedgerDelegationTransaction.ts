export interface ILedgerTransaction {
  senderAccount:number,
  senderAddress:string,
  receiverAddress:string,
  fee: number,
  amount: number,
  memo?:string,
  nonce:number,
  // TODO: FIX HARDCODING!
  txType: any,
  // TODO: FIX HARDCODING!
  networkId: any,
  validUntil:number,
}
