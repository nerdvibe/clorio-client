import { IBalanceData } from "../../../context/balance/BalanceInterfaces";
import { toMINA, toBTC } from "../../../tools";

interface ITicker {
  ticker: {
    BTCMINA: number | null;
  };
}

interface IUserBalance {
  balanceData: IBalanceData;
  balanceLoading: boolean;
  userBalance: number;
}

interface IUserBalanceToBTC {
  tickerData: ITicker;
  tickerLoading: boolean;
  userBalance: number;
}

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
