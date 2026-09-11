import {request} from './http';
import {ApiError} from './types';
import type {ITicker} from '../components/balance/BalanceTypes';
import type {INewsData} from '../types/NewsData';
import type {Blacklist} from '../types/Blacklist';
import type {IFeeQuery} from '../types/Fee';
import {DEFAULT_FEE} from '../tools/const';

interface NewsResponse {
  news?: unknown;
}

interface BlacklistResponse {
  blacklistedAddresses?: unknown;
}

interface FeesResponse {
  fast?: unknown;
  average?: unknown;
  txFees?: {fast?: unknown; average?: unknown};
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object';

interface TickerResponse {
  BTCMINA?: unknown;
  USDMINA?: unknown;
  mina?: {BTCMINA?: unknown; USDMINA?: unknown};
}

const asFiniteNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const asNullableNumber = (value: unknown): number | null => {
  if (value === null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeNews = (value: unknown): INewsData | null => {
  if (!isRecord(value)) return null;
  const fields = ['title', 'subtitle', 'link', 'cta', 'cta_color', 'visible'];
  if (fields.some(field => value[field] !== undefined && typeof value[field] !== 'string' && field !== 'visible')) {
    return null;
  }
  if (value.visible !== undefined && typeof value.visible !== 'boolean') return null;
  return value as INewsData;
};

export const getNews = async (apiUrl: string, placement: 'home' | 'validators'): Promise<INewsData[]> => {
  const data = await request<NewsResponse | unknown[]>(apiUrl, {
    method: 'GET',
    url: `/v1/content/news?placement=${placement}`,
  });
  const entries = Array.isArray(data) ? data : isRecord(data) && Array.isArray(data.news) ? data.news : null;
  const news = entries?.map(normalizeNews);
  if (!news || news.some(item => item === null)) {
    throw new ApiError('INVALID_RESPONSE', 'API returned invalid news data');
  }
  return news as INewsData[];
};

export const getBlacklist = async (apiUrl: string): Promise<Blacklist> => {
  const data = await request<BlacklistResponse | unknown[]>(apiUrl, {
    method: 'GET',
    url: '/v1/security/blacklisted-addresses',
  });
  const entries = Array.isArray(data)
    ? data
    : isRecord(data) && Array.isArray(data.blacklistedAddresses)
      ? data.blacklistedAddresses
      : null;
  if (!entries) throw new ApiError('INVALID_RESPONSE', 'API returned invalid blacklist data');
  const blacklistedAddresses = entries.map(value => {
    if (!isRecord(value) || typeof value.address !== 'string') return null;
    return {__typename: 'BlacklistedAddress', address: value.address};
  });
  if (blacklistedAddresses.some(item => item === null)) {
    throw new ApiError('INVALID_RESPONSE', 'API returned invalid blacklist data');
  }
  return {blacklistedAddresses: blacklistedAddresses as Blacklist['blacklistedAddresses']};
};

export const getFees = async (apiUrl: string): Promise<IFeeQuery> => {
  let data: FeesResponse;
  try {
    data = await request<FeesResponse>(apiUrl, {
      method: 'GET',
      url: '/v1/mina/fees',
    });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 405)) {
      return {estimatedFee: {txFees: {fast: DEFAULT_FEE, average: DEFAULT_FEE}}};
    }
    throw error;
  }
  const fast = asFiniteNumber(data?.fast ?? data?.txFees?.fast);
  const average = asFiniteNumber(data?.average ?? data?.txFees?.average);
  if (fast === null || average === null) {
    throw new ApiError('INVALID_RESPONSE', 'API returned invalid fee data');
  }
  return {estimatedFee: {txFees: {fast, average}}};
};

export const getTicker = async (apiUrl: string): Promise<ITicker> => {
  const data = await request<TickerResponse>(apiUrl, {
    method: 'GET',
    url: '/v1/ticker',
  });

  if (!data || typeof data !== 'object') {
    throw new ApiError('INVALID_RESPONSE', 'API returned invalid ticker data');
  }

  const ticker = data.mina || data;
  const BTCMINA = asNullableNumber(ticker.BTCMINA);
  const USDMINA = asNullableNumber(ticker.USDMINA);
  if (BTCMINA === null && ticker.BTCMINA !== null && ticker.BTCMINA !== undefined) {
    throw new ApiError('INVALID_RESPONSE', 'API returned invalid ticker data');
  }
  if (USDMINA === null && ticker.USDMINA !== null && ticker.USDMINA !== undefined) {
    throw new ApiError('INVALID_RESPONSE', 'API returned invalid ticker data');
  }

  return {ticker: {BTCMINA, USDTMINA: USDMINA}};
};
