import axios from "axios";
import { tickerCacheSet } from "../cache";
import { logger } from "@modules/log";

const log = logger("TICKER_SET_TICKER");

export const setTick = async () => {
  try {
    const currency = "mina-protocol";
    const exchange = "kraken";
    const baseCurrency = "MINA";
    const targetCurrency = ["XBT", "USD"];
    
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${currency}/tickers?exchange_ids=${exchange}`
    );

    const tick = data.tickers.filter(
      (t) => t.base === baseCurrency && targetCurrency.includes(t.target)
    );
    const priceBTC = tick.find((t) => t.target === targetCurrency[0]).last;
    const priceMina = tick.find((t) => t.target === targetCurrency[1]).last;
    
    tickerCacheSet({ BTCMINA: priceBTC, USDTMINA: priceMina  });
  } catch (e) {
    log.error("cache tick update failed", e);
  }
};
