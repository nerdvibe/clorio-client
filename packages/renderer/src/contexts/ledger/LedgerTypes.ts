export interface ILedgerContext {
  isLedgerEnabled: boolean;
  ledgerData: ILedgerContextData;
  setLedgerContext: (ledgerDta: ILedgerContextData) => void;
}

export interface ILedgerContextData {
  ledger: boolean;
  ledgerAccount: number;
}
