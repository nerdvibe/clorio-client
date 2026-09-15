import {beforeEach, describe, expect, it, vi} from 'vitest';
import {ApiError} from '../types';
import {request} from '../http';
import {getEpochInfo, getNetworkData} from '../network';

vi.mock('../http', () => ({
  request: vi.fn(),
}));

const mockedRequest = vi.mocked(request);

const networkSettings = {
  network: 'mainnet',
  name: 'Mina Mainnet',
};

describe('getEpochInfo', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('reads epoch data from Mina info', async () => {
    mockedRequest.mockResolvedValueOnce({
      epoch: 2,
      slot: 2867,
      height: 555045,
      remainingTime: {days: 4, hours: 10, minutes: 49},
    });

    await expect(getEpochInfo('https://devnet.clor.io')).resolves.toEqual({
      epoch: 2,
      slot: 2867,
      height: 555045,
      remainingTime: {days: 4, hours: 10, minutes: 49},
    });
    expect(mockedRequest).toHaveBeenCalledWith('https://devnet.clor.io', {
      method: 'GET',
      url: '/v1/mina/info/',
    });
  });

  it('rejects incomplete epoch data', async () => {
    mockedRequest.mockResolvedValueOnce({epoch: 2, slot: 2867, height: 555045});

    await expect(getEpochInfo('https://devnet.clor.io')).rejects.toEqual(
      new ApiError('INVALID_RESPONSE', 'API returned invalid epoch info'),
    );
  });
});

describe('getNetworkData', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('combines health and Mina info while preserving selected network metadata', async () => {
    mockedRequest
      .mockResolvedValueOnce({status: 'ok'})
      .mockResolvedValueOnce({height: 123, version: 2, syncStatus: 'SYNCED'});

    await expect(getNetworkData('https://api.example.com/v1', networkSettings)).resolves.toEqual({
      nodeInfo: {
        height: 123,
        name: 'Mina Mainnet',
        network: 'mainnet',
        version: 2,
        syncStatus: 'SYNCED',
        chainId: 'mainnet',
      },
    });
    expect(mockedRequest).toHaveBeenNthCalledWith(1, 'https://api.example.com/v1', {
      method: 'GET',
      url: '/v1/health/',
    });
    expect(mockedRequest).toHaveBeenNthCalledWith(2, 'https://api.example.com/v1', {
      method: 'GET',
      url: '/v1/mina/info/',
    });
  });

  it('rejects an invalid Mina info response', async () => {
    mockedRequest
      .mockResolvedValueOnce({status: 'ok'})
      .mockResolvedValueOnce({height: 'unknown'});

    await expect(getNetworkData('https://api.example.com/v1', networkSettings)).rejects.toEqual(
      new ApiError('INVALID_RESPONSE', 'API returned invalid Mina info'),
    );
  });
});
