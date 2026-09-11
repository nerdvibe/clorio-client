import {beforeEach, describe, expect, it, vi} from 'vitest';
import {ApiError} from '../types';
import {request} from '../http';
import {getBlacklist, getFees, getNews, getTicker} from '../content';

vi.mock('../http', () => ({
  request: vi.fn(),
}));

const mockedRequest = vi.mocked(request);

describe('getNews and getBlacklist', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('loads placement-specific news', async () => {
    mockedRequest.mockResolvedValue({news: [{title: 'Update', visible: true}]});

    await expect(getNews('https://api.example.com', 'home')).resolves.toEqual([
      {title: 'Update', visible: true},
    ]);
    expect(mockedRequest).toHaveBeenCalledWith('https://api.example.com', {
      method: 'GET',
      url: '/v1/content/news?placement=home',
    });
  });

  it('normalizes blacklist entries', async () => {
    mockedRequest.mockResolvedValue([{address: 'B62q'}]);

    await expect(getBlacklist('https://api.example.com')).resolves.toEqual({
      blacklistedAddresses: [{__typename: 'BlacklistedAddress', address: 'B62q'}],
    });
  });
});

describe('getFees', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('maps REST fee values to the legacy estimatedFee view shape', async () => {
    mockedRequest.mockResolvedValue({fast: 0.2, average: 0.1});

    await expect(getFees('https://api.example.com/v1')).resolves.toEqual({
      estimatedFee: {txFees: {fast: 0.2, average: 0.1}},
    });
    expect(mockedRequest).toHaveBeenCalledWith('https://api.example.com/v1', {
      method: 'GET',
      url: '/v1/mina/fees',
    });
  });

  it('falls back to the default fee when the optional endpoint is unavailable', async () => {
    mockedRequest.mockRejectedValue(new ApiError('HTTP_ERROR', 'Not found', 404));
    await expect(getFees('https://api.example.com')).resolves.toEqual({
      estimatedFee: {txFees: {fast: 0.1, average: 0.1}},
    });
  });

  it('rejects fee responses without numeric values', async () => {
    mockedRequest.mockResolvedValue({fast: '0.2', average: 0.1});

    await expect(getFees('https://api.example.com')).rejects.toEqual(
      new ApiError('INVALID_RESPONSE', 'API returned invalid fee data'),
    );
  });
});

describe('getTicker', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('maps the REST USDMINA value to the legacy USDTMINA view field', async () => {
    mockedRequest.mockResolvedValue({BTCMINA: 0.0001, USDMINA: 0.42});

    await expect(getTicker('https://api.example.com/v1')).resolves.toEqual({
      ticker: {BTCMINA: 0.0001, USDTMINA: 0.42},
    });
    expect(mockedRequest).toHaveBeenCalledWith('https://api.example.com/v1', {
      method: 'GET',
      url: '/v1/ticker',
    });
  });

  it('rejects a ticker response without numeric values', async () => {
    mockedRequest.mockResolvedValue({mina: {BTCMINA: 'not-a-number', USDMINA: '0.42'}});

    await expect(getTicker('https://api.example.com/v1')).rejects.toEqual(
      new ApiError('INVALID_RESPONSE', 'API returned invalid ticker data'),
    );
  });
});
