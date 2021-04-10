export interface IBalanceData {
  liquid: string|number;
  liquidUnconfirmed: string|number;
  locked: string|number;
  total: string|number;
  unconfirmedTotal: string|number;
}

export interface IBalanceContext {
  shouldBalanceUpdate: boolean;
  balance: IBalanceData;
  setBalanceContext: (data: IBalanceData) => void;
  setShouldBalanceUpdate: (shouldUpdate: boolean) => void;
}
