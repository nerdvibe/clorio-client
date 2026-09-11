import {beforeEach, describe, expect, it, vi} from 'vitest';
import {ApiError} from '../types';
import {request} from '../http';
import {broadcastDelegation, broadcastPayment, getMempool, getTransactions} from '../transactions';

vi.mock('../http', () => ({
  request: vi.fn(),
}));

const mockedRequest = vi.mocked(request);
const publicKey = 'B62q/account';

describe('broadcast resources', () => {
  beforeEach(() => mockedRequest.mockReset());

  it('posts a payment input and signature', async () => {
    mockedRequest.mockResolvedValue({hash: 'tx-hash'});
    const input = {to: 'B62q'};
    const signature = {field: '1', scalar: '2'};

    await expect(broadcastPayment('https://api.example.com', input, signature)).resolves.toEqual({
      hash: 'tx-hash',
    });
    expect(mockedRequest).toHaveBeenCalledWith('https://api.example.com', {
      method: 'POST',
      url: '/v1/mina/transaction',
      data: {input, signature},
    });
  });

  it('posts a delegation input and signature', async () => {
    mockedRequest.mockResolvedValue({id: 'tx-id'});

    await expect(
      broadcastDelegation('https://api.example.com', {to: 'B62q'}, {rawSignature: 'sig'}),
    ).resolves.toEqual({id: 'tx-id'});
    expect(mockedRequest).toHaveBeenCalledWith('https://api.example.com', {
      method: 'POST',
      url: '/v1/mina/transaction/delegation',
      data: {input: {to: 'B62q'}, signature: {rawSignature: 'sig'}},
    });
  });
});

describe('transaction resources', () => {
  beforeEach(() => mockedRequest.mockReset());

  it('fetches public-key history with pagination and preserves the response total', async () => {
    mockedRequest.mockResolvedValue({
      total: 12,
      transactions: [
        {
          hash: 'tx-1',
          amount: '1000000000',
          fee: '1000000',
          memo: '',
          timestamp: '123',
          status: 'applied',
          sender_public_key: publicKey,
          receiver_public_key: 'B62q/receiver',
          command_type: 'payment',
          failure_reason: '',
        },
      ],
    });

    await expect(getTransactions('https://api.example.com/v1', publicKey, 20, 10)).resolves.toEqual({
      total: 12,
      transactions: expect.any(Array),
    });
    expect(mockedRequest).toHaveBeenCalledWith('https://api.example.com/v1', {
      method: 'GET',
      url: `/v1/mina/transactions/${encodeURIComponent(publicKey)}?offset=20&limit=10`,
    });
  });

  it('fetches mempool entries by public key', async () => {
    mockedRequest.mockResolvedValue({
      mempool: [
        {
          id: 'pending-1',
          amount: '1000000000',
          fee: '1000000',
          memo: '',
          kind: 'PAYMENT',
          source: {publicKey},
          receiver: {publicKey: 'B62q/receiver'},
        },
      ],
    });

    await expect(getMempool('https://api.example.com', publicKey)).resolves.toMatchObject({
      mempool: [{id: 'pending-1'}],
    });
    expect(mockedRequest).toHaveBeenCalledWith('https://api.example.com', {
      method: 'GET',
      url: `/v1/mina/mempool/${encodeURIComponent(publicKey)}`,
    });
  });

  it('rejects a history response without a numeric total', async () => {
    mockedRequest.mockResolvedValue({transactions: []});

    await expect(getTransactions('https://api.example.com', publicKey, 0, 10)).rejects.toEqual(
      new ApiError('INVALID_RESPONSE', 'API returned invalid transactions data'),
    );
  });
});
