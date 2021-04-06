import { toMINA, toBTC } from "../../../tools";

export interface ITicker {
  ticker: {
    BTCMINA: number | null;
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

interface IUserBalance {
  balanceData?: IBalanceQueryResult;
  balanceLoading: boolean;
  userBalance: number;
}

/**
 * If balance data is available from the query, return the amount
 * @param object
 * @returns string
 */
export const renderBalance = ({
  balanceData,
  balanceLoading,
  userBalance,
}: IUserBalance) => {
  if (balanceLoading) {
    return "Loading ";
  }
  if (balanceData) {
    if (!userBalance) {
      return "Not available";
    } else {
      return toMINA(userBalance) + " Mina";
    }
  }
  return "Not available";
};

interface IUserBalanceToBTC {
  tickerData?: ITicker;
  tickerLoading: boolean;
  userBalance: number;
}

/**
 * Convert user's Mina balance to BTC
 * @param object
 * @returns string
 */
export const userBalanceToBTCValue = ({
  tickerData,
  tickerLoading,
  userBalance,
}: IUserBalanceToBTC) => {
  if (tickerLoading) {
    return "Loading ";
  }
  if (tickerData?.ticker) {
    if (tickerData.ticker.BTCMINA === null) {
      return "Not available";
    } else {
      const amount = userBalance * tickerData.ticker.BTCMINA;
      return toBTC(amount) + " BTC";
    }
  }
  return "Not available";
};
