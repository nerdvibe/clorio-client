export interface ILedgerDelegationTransaction {
  senderAccount:string,
  senderAddress:string,
  receiverAddress:string,
  fee: number,
  amount: number,
  nonce:number,
  // TODO: FIX HARDCODING!
  txType: any,
  // TODO: FIX HARDCODING!
  networkId: any,
  validUntil:number,
}
