import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Tickers {
    BTCMINA: String
    USDTMINA: String
  }

  type Query {
    ticker: Tickers
  }
`);
