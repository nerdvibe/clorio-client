import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Balance {
    total: String
    liquid: String
    locked: String
    unconfirmedTotal: String
    liquidUnconfirmed: String
  }

  type Delegate {
    publicKey: String
    name: String
  }
  
  type SourceReceiver {
    publicKey: String
  }
  
  type Mempool {
    id: String
    nonce: Int
    amount: String
    source: SourceReceiver
    receiver: SourceReceiver
    fee: String
  }

  type Account {
    balance: Balance
    delegate: Delegate
    nonce: Int
    mempool: [Mempool]
    unconfirmedNonce: Int
    usableNonce: Int
  }

  type IdByPublicKey {
    id: String
  }

  type Query {
    accountByKey(publicKey: String!): Account
    idByPublicKey(publicKey: String!): IdByPublicKey
  }
`);
