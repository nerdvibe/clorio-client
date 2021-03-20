import { gql } from "@apollo/client";
import { ITEMS_PER_PAGE } from "./const";


export const GET_FEE = gql`
query GetFees {
  estimatedFee {
    average
    fast
  }
}
`;

export const GET_NONCE = gql`
query accountByKey($publicKey: String!) {
  accountByKey(publicKey: $publicKey) {
    usableNonce
  }
}
`;

export const BROADCAST_TRANSACTION = gql`
mutation broadcastTransaction(
  $input: SendPaymentInput!
  $signature: SignatureInput!
) {
  broadcastTransaction(input: $input, signature: $signature) {
    id
  }
}
`;

export const BROADCAST_DELEGATION = gql`
  mutation broadcastDelegation(
    $input: SendDelegationInput!
    $signature: SignatureInput
  ) {
    broadcastDelegation(input: $input, signature: $signature) {
      id
    }
  }
`;


export const GET_AVERAGE_FEE = gql`
  query GetFees {
    estimatedFee {
      average
    }
  }
`;

export const GET_VALIDATORS = gql`
  query validators($offset: Int!) {
    validators(limit: ${ITEMS_PER_PAGE}, offset: $offset) {
      fee
      id
      image
      name
      publicKey
      website
    }
  }
`;

export const GET_VALIDATORS_NEWS = gql`
  query NewsValidators {
    news_validators(limit: 10) {
      title
      subtitle
      link
      cta
      cta_color
    }
  }
`;

export const GET_NONCE_AND_DELEGATE = gql`
  query accountByKey($publicKey: String!) {
    accountByKey(publicKey: $publicKey) {
      delegate {
        publicKey
      }
      usableNonce
    }
  }
`;

export const GET_ID = gql`
  query GetIDFromPublicKey($publicKey: String) {
    public_keys(where: { value: { _eq: $publicKey } }) {
      id
    }
  }
`;

export const GET_TRANSACTIONS_TOTAL = gql`
  query TransactionsTotal($user: Int!) {
    user_commands_aggregate(
      where: {
        _or: [{ receiver_id: { _eq: $user } }, { source_id: { _eq: $user } }]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_NETWORK = gql`
  query NodeInfo {
    nodeInfo {
      height
      name
      network
      version
    }
  }
`;

export const GET_TICKER = gql`
  query ticker {
    ticker {
      BTCMINA
    }
  }
`;

export const GET_BALANCE = gql`
  query accountByKey($publicKey: String!) {
    accountByKey(publicKey: $publicKey) {
      balance {
        total
        liquid
        locked
        liquidUnconfirmed
      }
    }
  }
`;

export const GET_VALIDATORS_TOTAL = gql`
  query CountValidators {
    validators_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions($user: Int!, $offset: Int!) {
    user_commands(
      where: {
        _or: [{ receiver_id: { _eq: $user } }, { source_id: { _eq: $user } }]
      }
      order_by: { id: desc }
      limit: ${ITEMS_PER_PAGE}
      offset: $offset
    ) {
      amount
      fee
      id
      hash
      memo
      publicKeyBySourceId {
        value
      }
      publicKeyByReceiverId {
        value
      }
      token
      type
      valid_until
      nonce
      blocks_user_commands {
        block {
          height
          timestamp
          state_hash
        }
      }
    }
  }
`;

export const GET_MEMPOOL = gql`
  query GetMempool($publicKey: String!) {
    mempool(publicKey: $publicKey) {
      id
      fee
      feeToken
      kind
      amount
      nonce
      source {
        publicKey
      }
      receiver {
        publicKey
      }
    }
  }
`;

export const GET_HOME_NEWS = gql`
  query NewsHome {
    news_home(limit: 1) {
      title
      subtitle
      link
      cta
      cta_color
    }
  }
`;
