import {describe, expect, it} from 'vitest';
import {createDelegationPaymentInputFromPayload} from '../transactions';

describe('createDelegationPaymentInputFromPayload', () => {
  it('always includes the memo required by the delegation API', () => {
    expect(
      createDelegationPaymentInputFromPayload({
        nonce: 26,
        fee: 100000000,
        validUntil: 4294967295,
        to: 'B62qq6ZYPG5JsjZnGJ3pADmRn6hU6qy13EhraTSymjSgyEDwoDR9Gd6',
        from: 'B62qqTWyaBWQwra9NTTNg1RNRTYxDWxsqfyDz4R7y5XKhvKQLLJXUZ8',
      }),
    ).toMatchObject({memo: ''});
  });
});
