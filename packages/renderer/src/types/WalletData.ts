export interface IWalletData {
  type?: string;
  address: string;
  /** Legacy backend account ID; new sessions do not write it. */
  id?: number;
  ledger: boolean;
  ledgerAccount: number;
  mnemonic: boolean;
  accountNumber?: number;
  isAuthenticated?: boolean;
}
