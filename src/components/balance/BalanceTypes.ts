export interface ITicker {
  ticker: {
    BTCMINA: number | null;
    USDTMINA: number | null;
  };
}

export interface IBalanceQueryResult {
  accountByKey: {
    balance: {
      total: number;
      liquid: number;
      locked: number;
      liquidUnconfirmed: number;
      unconfirmedTotal: number;
    };
  };
}

export interface IUserBalance {
  balanceData?: IBalanceQueryResult;
  balanceLoading: boolean;
  userBalance: number;
}
