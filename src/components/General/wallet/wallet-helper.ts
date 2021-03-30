import { IBalanceData } from './../../../context/balance-type.d';
import { toMINA } from "../../../tools";

interface ITicker{
  ticker:{
    BTCMINA: number|null
  }
}

export const renderBalance = (balanceData:IBalanceData,loading:boolean,userBalance:number) => {
  if (loading) {
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
}

export const renderAverageValue = (tickerData:ITicker,loading:boolean,userBalance:number) => {
  if (loading) {
    return "Loading ";
  }
  if (tickerData?.ticker) {
    if (tickerData.ticker.BTCMINA === null) {
      return "Not available";
    } else {
      const amount = userBalance * tickerData.ticker.BTCMINA
      return toMINA(amount) + " BTC";
    }
  }
  return "Not available";
}
