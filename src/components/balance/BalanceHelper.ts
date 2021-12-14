import { toMINA, toDecimal } from "../../tools";
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
  symbol?: "BTC" | "USDT";
  ticker?: "BTCMINA" | "USDTMINA";
}

/**
 * Convert user's Mina balance to BTC
 * @param object
 * @returns string
 */
export const userBalanceToSymbolValue = ({
  tickerData,
  tickerLoading,
  userBalance,
  symbol = "BTC",
  ticker = "BTCMINA",
}: IUserBalanceToBTC) => {
  if (tickerLoading) {
    return "Loading ";
  }
  if (tickerData?.ticker && tickerData.ticker[ticker] !== null) {
    const amount = userBalance * (tickerData.ticker[ticker] || 0);
    return `${toDecimal(amount)} ${symbol}`;
  }
  return `${(0).toFixed(3)} ${symbol}`;
};
