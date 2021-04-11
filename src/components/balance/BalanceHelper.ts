import { toMINA, toBTC } from "../../tools";
import { ITicker, IUserBalance } from "./BalanceTypes";

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
  if (balanceData && userBalance) {
    return toMINA(userBalance) + " Mina";
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
  if (tickerData && tickerData.ticker?.BTCMINA !== null) {
    const amount = userBalance * tickerData.ticker.BTCMINA;
    return toBTC(amount) + " BTC";
  }
  return "Not available";
};
