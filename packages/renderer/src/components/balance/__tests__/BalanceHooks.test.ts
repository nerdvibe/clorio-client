import {describe, expect, it} from 'vitest';
import {toBalanceQueryResult} from '../BalanceHooks';

const account = {
  publicKey: 'B62q/account',
  nonce: 4,
  pendingNonce: 5,
  balance: {
    total: '10.5',
    liquid: '8.5',
    locked: '2',
    liquidUnconfirmed: '8.25',
    unconfirmedTotal: '10.25',
  },
  delegate: null,
};

describe('toBalanceQueryResult', () => {
  it('preserves REST balance fields in the UI account shape', () => {
    expect(toBalanceQueryResult(account)).toEqual({
      accountByKey: {
        balance: {
          total: 10.5,
          liquid: 8.5,
          locked: 2,
          liquidUnconfirmed: 8.25,
          unconfirmedTotal: 10.25,
        },
      },
    });
  });
});
