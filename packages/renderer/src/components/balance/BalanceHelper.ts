import {toMINA, toDecimal} from '../../tools';
import type {IBalanceQueryResult, ITicker, IUserBalance} from './BalanceTypes';
interface IUserBalanceToBTC {
  tickerData?: ITicker;
  userBalance: number;
  symbol?: 'BTC' | 'USDT';
  ticker?: 'BTCMINA' | 'USDTMINA';
}
interface IFormatBalance {
  balanceData?: IBalanceQueryResult;
  userBalance: number;
  tickerData?: ITicker;
}

/**
 * If balance data is available from the query, return the amount
 * @param object
 * @returns string
 */
export const renderBalance = ({balanceData, userBalance}: IUserBalance) => {
  if (balanceData && userBalance) {
    return toMINA(userBalance) + ' Mina';
  }
  return 'Not available';
};

/**
 * Convert user's Mina balance to BTC
 * @param object
 * @returns string
 */
export const userBalanceToSymbolValue = ({
  tickerData,
  userBalance,
  symbol = 'BTC',
  ticker = 'BTCMINA',
}: IUserBalanceToBTC) => {
  if (tickerData?.ticker && tickerData.ticker[ticker] !== null) {
    const amount = userBalance * (tickerData.ticker[ticker] || 0);
    return `${toDecimal(amount)} ${symbol}`;
  }
  return `${(0).toFixed(3)} ${symbol}`;
};

export const formatBalance = ({balanceData, userBalance, tickerData}: IFormatBalance) => {
  const dataToReturn = {
    mina: '0',
    btc: '0',
    usdt: '0',
  };
  dataToReturn.mina = renderBalance({balanceData, userBalance});
  dataToReturn.btc = userBalanceToSymbolValue({
    tickerData,
    userBalance,
    symbol: 'BTC',
    ticker: 'BTCMINA',
  });
  dataToReturn.usdt = userBalanceToSymbolValue({
    tickerData,
    userBalance,
    symbol: 'USDT',
    ticker: 'USDTMINA',
  });
  return dataToReturn;
};
