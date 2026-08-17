import axios, {AxiosError} from 'axios';
import type {AxiosRequestConfig} from 'axios';
import {ApiError} from './types';

export const normalizeApiUrl = (value: string): string => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('API URL is required');
  }
  if (value.includes('#')) {
    throw new TypeError('API URL must not contain a fragment');
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new TypeError('API URL must be a valid absolute URL');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new TypeError('API URL must use HTTP or HTTPS');
  }
  if (url.username || url.password) {
    throw new TypeError('API URL must not contain credentials');
  }
  const pathname = url.pathname.replace(/\/+$/, '');
  return `${url.origin}${pathname}${url.search}`;
};

const normalizeError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }
  if (!axios.isAxiosError(error)) {
    return new ApiError('UNKNOWN_ERROR', 'API request failed');
  }
  if (axios.isCancel(error) || error.code === AxiosError.ERR_CANCELED) {
    return new ApiError('CANCELLED', 'API request cancelled');
  }
  if (
    error.code === AxiosError.ERR_BAD_RESPONSE &&
    error.response &&
    error.response.status < 400
  ) {
    return new ApiError('INVALID_RESPONSE', 'API returned malformed JSON');
  }
  if (error.response) {
    return new ApiError(
      'HTTP_ERROR',
      `API request failed with status ${error.response.status}`,
      error.response.status,
    );
  }
  return new ApiError('NETWORK_ERROR', 'API network request failed');
};

export const request = async <T>(apiUrl: string, config: AxiosRequestConfig): Promise<T> => {
  if (config.url && /^([a-z][a-z\d+\-.]*:)?\/\//i.test(config.url)) {
    throw new TypeError('Request URL must be relative');
  }

  try {
    const response = await axios.request<T>({
      ...config,
      baseURL: normalizeApiUrl(apiUrl),
      headers: {
        ...config.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      responseType: 'json',
      transitional: {
        ...config.transitional,
        silentJSONParsing: false,
      },
    });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};
