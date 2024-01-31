import { buildSchema } from "graphql";

export const schema = buildSchema(`
  input SignatureInput {
    # Raw encoded signature
    rawSignature: String
    # Scalar component of signature
    scalar: String
    # Field component of signature
    field: String
  }
  
  input SendPaymentInput {
    # Should only be set when cancelling transactions, otherwise a nonce is determined
    # automatically
    nonce: String
    # Short arbitrary message provided by the sender
    memo: String
    # The global slot number after which this transaction cannot be applied
    validUntil: String
    # Fee amount in order to send payment
    fee: String!
    # Amount of coda to send to to receiver
    amount: String!
    # Token to send
    token: String
    # Public key of recipient of payment
    to: String!
    # Public key of sender of payment
    from: String!
  }
  
  input SendDelegationInput {
    # Should only be set when cancelling transactions, otherwise a nonce is determined
    # automatically
    nonce: String
    # Short arbitrary message provided by the sender
    memo: String
    # The global slot number after which this transaction cannot be applied
    validUntil: String
    # Fee amount in order to send a stake delegation
    fee: String!
    # Public key of the account being delegated to
    to: String!
    # Public key of sender of a stake delegation
    from: String!
  }
  
  type SourceReceiver {
    publicKey: String
  }
  
  type BroadcastTransaction {
    id: String
    nonce: Int
    amount: String
    source: SourceReceiver
    receiver: SourceReceiver
    fee: String
  }
  
  type BroadcastDelegation {
    id: String
  }
  
  type MempoolElement {
    id: String
    fee: String
    feeToken: String
    kind: String
    amount: String
    nonce: String
    source: SourceReceiver
    receiver: SourceReceiver
  }
  
  type TransactionsCount {
    count: Int
  }
  
  type Transaction {
    id: String!
    command_type: String!
    fee_payer_id: String!
    source_id: String!
    receiver_id: String!
    nonce: String!
    amount: String!
    fee: String!
    valid_until: String
    memo: String
    hash: String!
    status: String
    failure_reason: String
    timestamp: String!
    sender_public_key: String!
    receiver_public_key: String!
  }
  
  type Query {
    # this query is a workaround for schema stitching with only mutations
    mempool(publicKey: String!): [MempoolElement]
    transactionsCount(accountId: Int!): TransactionsCount
    transactions(accountId: Int!, offset: Int!): [Transaction]
  }

  type Mutation {
    broadcastTransaction(signature: SignatureInput, input: SendPaymentInput!): BroadcastTransaction!
    broadcastDelegation(signature: SignatureInput, input: SendDelegationInput!): BroadcastDelegation!
  }
`);
