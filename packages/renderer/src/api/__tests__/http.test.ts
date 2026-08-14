import {describe, expect, it, vi} from 'vitest';
import type {AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {request, normalizeApiUrl} from '../http';
import {ApiError} from '../types';

const jsonResponse = (data: unknown, status = 200): AxiosAdapter => {
  return async config =>
    ({
      data,
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      headers: {'content-type': 'application/json'},
      config,
      request: {},
    }) as AxiosResponse;
};

const axiosError = (message: string, code: string, response?: Partial<AxiosResponse>): Error => {
  return Object.assign(new Error(message), {
    name: 'AxiosError',
    code,
    config: {} as InternalAxiosRequestConfig,
    isAxiosError: true,
    response,
    toJSON: () => ({}),
  });
};

describe('normalizeApiUrl', () => {
  it.each([
    ['https://api.example.com', 'https://api.example.com'],
    ['https://api.example.com///', 'https://api.example.com'],
    ['http://localhost:3000/v1///', 'http://localhost:3000/v1'],
  ])('normalizes %s', (value, expected) => {
    expect(normalizeApiUrl(value)).toBe(expected);
  });

  it.each([
    '',
    '/v1',
    'ftp://api.example.com',
    'https://user:secret@api.example.com',
    'https://api.example.com/v1#wallet',
    'https://api.example.com/v1#',
  ])('rejects unsafe API URL %j', value => {
    expect(() => normalizeApiUrl(value)).toThrow(TypeError);
  });
});

describe('request', () => {
  it('returns parsed JSON and applies the explicit API URL, JSON headers, and signal', async () => {
    const controller = new AbortController();
    const adapter = vi.fn<Parameters<AxiosAdapter>, ReturnType<AxiosAdapter>>(async config => {
      expect(config.baseURL).toBe('https://api.example.com/v1');
      expect(config.headers.get('Accept')).toBe('application/json');
      expect(config.headers.get('Content-Type')).toBe('application/json');
      expect(config.signal).toBe(controller.signal);
      return jsonResponse('{"healthy":true}')(config);
    });

    const result = await request<{healthy: boolean}>('https://api.example.com/v1///', {
      method: 'GET',
      url: '/health',
      signal: controller.signal,
      adapter,
    });

    expect(result).toEqual({healthy: true});
    expect(adapter).toHaveBeenCalledOnce();
  });

  it('normalizes malformed JSON as an invalid-response ApiError', async () => {
    await expect(
      request('https://api.example.com', {
        url: '/health',
        adapter: jsonResponse('{not-json'),
      }),
    ).rejects.toMatchObject({
      name: 'ApiError',
      code: 'INVALID_RESPONSE',
      message: 'API returned malformed JSON',
    } satisfies Partial<ApiError>);
  });

  it('normalizes HTTP failures without exposing the response body', async () => {
    const error = axiosError('Request failed with status code 503', 'ERR_BAD_RESPONSE', {
      status: 503,
      data: {wallet: 'sensitive server detail'},
    });

    await expect(
      request('https://api.example.com', {
        url: '/account',
        adapter: async () => Promise.reject(error),
      }),
    ).rejects.toEqual(new ApiError('HTTP_ERROR', 'API request failed with status 503', 503));
  });

  it('normalizes network failures', async () => {
    const error = axiosError('Network Error', 'ERR_NETWORK');

    await expect(
      request('https://api.example.com', {
        url: '/health',
        adapter: async () => Promise.reject(error),
      }),
    ).rejects.toEqual(new ApiError('NETWORK_ERROR', 'API network request failed'));
  });

  it('normalizes cancellation and does not call the adapter', async () => {
    const controller = new AbortController();
    const adapter = vi.fn(jsonResponse('{}'));
    controller.abort();

    await expect(
      request('https://api.example.com', {
        url: '/health',
        signal: controller.signal,
        adapter,
      }),
    ).rejects.toEqual(new ApiError('CANCELLED', 'API request cancelled'));
    expect(adapter).not.toHaveBeenCalled();
  });
});
