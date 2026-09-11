import {beforeEach, describe, expect, it, vi} from 'vitest';
import {ApiError} from '../types';
import {request} from '../http';
import {getAccount, toNonceQueryResult} from '../account';

vi.mock('../http', () => ({
  request: vi.fn(),
}));

const mockedRequest = vi.mocked(request);
const publicKey = 'B62q/account key';

describe('toNonceQueryResult', () => {
  it('exposes pendingNonce through the legacy nonce query shape', () => {
    expect(
      toNonceQueryResult({
        publicKey,
        nonce: 7,
        pendingNonce: 9,
        balance: {
          total: '10',
          liquid: '8',
          locked: '2',
          liquidUnconfirmed: '8.5',
          unconfirmedTotal: '10.5',
        },
        delegate: null,
      }),
    ).toEqual({accountByKey: {usableNonce: 9}});
  });
});

describe('getAccount', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('combines account data with outgoing mempool entries for pendingNonce', async () => {
    mockedRequest
      .mockResolvedValueOnce({
        publicKey,
        nonce: 7,
        balance: {
          total: '10',
          liquid: '8',
          locked: '2',
          liquidUnconfirmed: '8.5',
          unconfirmedTotal: '10.5',
        },
        delegate: {publicKey: 'B62q/delegate', name: 'Validator'},
      })
      .mockResolvedValueOnce({
        mempool: [
          {source: {publicKey}},
          {source: {publicKey: 'B62q/other'}},
          {source: {publicKey}},
        ],
      });

    await expect(getAccount('https://api.example.com/v1', publicKey)).resolves.toEqual({
      publicKey,
      nonce: 7,
      pendingNonce: 9,
      balance: {
        total: '10',
        liquid: '8',
        locked: '2',
        liquidUnconfirmed: '8.5',
        unconfirmedTotal: '10.5',
      },
      delegate: {publicKey: 'B62q/delegate', name: 'Validator'},
    });
    expect(mockedRequest).toHaveBeenNthCalledWith(1, 'https://api.example.com/v1', {
      method: 'GET',
      url: `/v1/mina/accounts/${encodeURIComponent(publicKey)}`,
    });
    expect(mockedRequest).toHaveBeenNthCalledWith(2, 'https://api.example.com/v1', {
      method: 'GET',
      url: `/v1/mina/mempool/${encodeURIComponent(publicKey)}`,
    });
  });

  it('accepts the deployed scalar balance and delegate response shape', async () => {
    mockedRequest
      .mockResolvedValueOnce({balance: '0', nonce: 0, delegate: null})
      .mockRejectedValueOnce(new ApiError('HTTP_ERROR', 'API request failed with status 500', 500));

    await expect(getAccount('https://api.example.com', publicKey)).resolves.toEqual({
      publicKey,
      nonce: 0,
      pendingNonce: 0,
      balance: {
        total: '0',
        liquid: '0',
        locked: '0',
        liquidUnconfirmed: '0',
        unconfirmedTotal: '0',
      },
      delegate: null,
    });
  });

  it('accepts a raw mempool array from the deployed endpoint', async () => {
    mockedRequest
      .mockResolvedValueOnce({balance: '43128000000', nonce: 25, delegate: 'B62q/delegate'})
      .mockResolvedValueOnce([]);

    await expect(getAccount('https://api.example.com', publicKey)).resolves.toMatchObject({
      nonce: 25,
      pendingNonce: 25,
      balance: {
        total: '43128000000',
        liquid: '43128000000',
        unconfirmedTotal: '43128000000',
      },
      delegate: {publicKey: 'B62q/delegate'},
    });
  });

  it('preserves zero nonce and a missing delegate', async () => {
    mockedRequest
      .mockResolvedValueOnce({
        publicKey,
        nonce: 0,
        balance: {
          total: '0',
          liquid: '0',
          locked: '0',
          liquidUnconfirmed: '0',
          unconfirmedTotal: '0',
        },
        delegate: null,
      })
      .mockResolvedValueOnce({mempool: []});

    await expect(getAccount('https://api.example.com', publicKey)).resolves.toMatchObject({
      nonce: 0,
      pendingNonce: 0,
      delegate: null,
    });
  });

  it('propagates a sanitized account-not-found error', async () => {
    mockedRequest.mockRejectedValue(
      new ApiError('HTTP_ERROR', 'API request failed with status 404', 404),
    );

    await expect(getAccount('https://api.example.com', publicKey)).rejects.toEqual(
      new ApiError('HTTP_ERROR', 'API request failed with status 404', 404),
    );
  });

  it('rejects an account response with invalid balance fields', async () => {
    mockedRequest
      .mockResolvedValueOnce({
        publicKey,
        nonce: 1,
        balance: {total: '1'},
        delegate: null,
      })
      .mockResolvedValueOnce({mempool: []});

    await expect(getAccount('https://api.example.com', publicKey)).rejects.toEqual(
      new ApiError('INVALID_RESPONSE', 'API returned invalid account data'),
    );
  });
});
