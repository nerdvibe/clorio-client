import {request} from './http';
import {ApiError} from './types';
import type {INetworkData, INodeInfo} from '../types/NetworkData';

export interface NetworkMetadata {
  network: string;
  name: string;
}

interface HealthResponse {
  status?: unknown;
  syncStatus?: unknown;
  chainId?: unknown;
}

interface MinaInfoResponse {
  height?: unknown;
  version?: unknown;
  syncStatus?: unknown;
  chainId?: unknown;
  network?: unknown;
  name?: unknown;
}

interface EpochInfoResponse {
  epoch?: unknown;
  slot?: unknown;
  height?: unknown;
  remainingTime?: unknown;
}

export interface EpochInfo {
  epoch: number;
  slot: number;
  height: number;
  remainingTime: {
    days: number;
    hours: number;
    minutes: number;
  };
}

const asFiniteNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const asString = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() !== '' ? value : fallback;

const asSyncStatus = (value: unknown): INodeInfo['syncStatus'] => {
  if (value === 'SYNCED' || value === 'BOOTSTRAPPING' || value === 'CATCHUP') {
    return value;
  }
  return 'UNKNOWN';
};

const invalidMinaInfo = (): ApiError =>
  new ApiError('INVALID_RESPONSE', 'API returned invalid Mina info');

const invalidEpochInfo = (): ApiError =>
  new ApiError('INVALID_RESPONSE', 'API returned invalid epoch info');

const asNonNegativeInteger = (value: unknown): number | null => {
  const number = asFiniteNumber(value);
  return number !== null && Number.isInteger(number) && number >= 0 ? number : null;
};

export const getEpochInfo = async (apiUrl: string): Promise<EpochInfo> => {
  const data = await request<EpochInfoResponse>(apiUrl, {
    method: 'GET',
    url: '/v1/mina/info/',
  });
  const remainingTime = data?.remainingTime;
  if (!data || typeof data !== 'object' || !remainingTime || typeof remainingTime !== 'object') {
    throw invalidEpochInfo();
  }

  const epoch = asNonNegativeInteger(data.epoch);
  const slot = asNonNegativeInteger(data.slot);
  const height = asNonNegativeInteger(data.height);
  const time = remainingTime as Record<string, unknown>;
  const days = asNonNegativeInteger(time.days);
  const hours = asNonNegativeInteger(time.hours);
  const minutes = asNonNegativeInteger(time.minutes);
  if (epoch === null || slot === null || height === null || days === null || hours === null || minutes === null) {
    throw invalidEpochInfo();
  }

  return {epoch, slot, height, remainingTime: {days, hours, minutes}};
};

export const getNetworkData = async (
  apiUrl: string,
  metadata: NetworkMetadata,
): Promise<INetworkData> => {
  const [health, info] = await Promise.all([
    request<HealthResponse>(apiUrl, {method: 'GET', url: '/v1/health/'}),
    request<MinaInfoResponse>(apiUrl, {method: 'GET', url: '/v1/mina/info/'}),
  ]);

  if (!info || typeof info !== 'object') {
    throw invalidMinaInfo();
  }

  const height = asFiniteNumber(info.height);
  const version = asFiniteNumber(info.version) ?? 0;
  if (height === null) {
    throw invalidMinaInfo();
  }

  return {
    nodeInfo: {
      height,
      name: asString(info.name, metadata.name),
      network: asString(info.network, metadata.network),
      version,
      syncStatus: asSyncStatus(info.syncStatus ?? health?.syncStatus),
      chainId: asString(info.chainId ?? health?.chainId, metadata.network),
    },
  };
};
