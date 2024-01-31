import gql from "graphql-tag";
import { minaNodeClient } from "../minaNodeClient";
import Big from "big.js";
import {validatorsByPublicKeyCacheGet} from "@modules/cache/validators";

const defaultAccount = {
  balance: {
    total: 0,
    liquid: 0,
    locked: 0,
  },
  delegateAccount: {
    publicKey: undefined
  },
  nonce: 0
}

export const account = async ({ publicKey }) => {
    const { data } = await minaNodeClient.query({
      query: gql`
        query account($publicKey: String) {
          account(publicKey: $publicKey) {
            balance {
              total
              liquid
              locked
            }
            delegateAccount {
              publicKey
            }
            nonce
          }
          pooledUserCommands(publicKey: $publicKey) {
            id
            nonce
            amount
            source {publicKey}
            receiver {publicKey}
            fee
            feeToken
          }
        }
      `,
      variables: {
        publicKey,
      },
      fetchPolicy: "no-cache"
    });

    const account = data.account ?? defaultAccount;
    const nonce = account.nonce;
    const mempool = [...data.pooledUserCommands];
    const unconfirmedNonce = mempool.length ? Math.max(...mempool.map(tx => tx.nonce)) : -1;
    const usableNonce = Math.max(nonce, unconfirmedNonce + 1);
    const unconfBalance: number = mempool.reduce((acc, curr) => {
        if (curr.feeToken === '1' && curr.source.publicKey === publicKey) {
            return +Big(acc).minus(Big(curr.fee).plus(curr.amount)).round(8)
      }
      return acc
    }, account.balance.total as number)
    const liquidUnconfirmed = Big(unconfBalance).minus(account.balance.locked).round(8).toString()

    let delegateName = null;
    if(account?.delegateAccount?.publicKey) {
        delegateName = await validatorsByPublicKeyCacheGet(account?.delegateAccount?.publicKey);
    }

    return {
      balance: {unconfirmedTotal: unconfBalance, liquidUnconfirmed, ...account.balance},
      delegate: {
          publicKey: account.delegateAccount?.publicKey || null,
          name: delegateName
      },
      nonce,
      unconfirmedNonce,
      usableNonce,
      mempool: data.pooledUserCommands,
    };
};
