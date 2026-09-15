import {request} from './http';
import {ApiError} from './types';
import type {IValidatorData} from '../components/stake/stakeTableRow/ValidatorDataTypes';

export interface ValidatorsResponse {
  total: number;
  validators: IValidatorData[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object';

const invalidValidators = (): ApiError =>
  new ApiError('INVALID_RESPONSE', 'API returned invalid validators data');

const asNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const normalizeValidator = (value: unknown): IValidatorData | null => {
  if (!isRecord(value) || typeof value.publicKey !== 'string') return null;
  const fee = asNumber(value.fee);
  const stakedSum = asNumber(value.stakedSum ?? value.stake);
  return {
    publicKey: value.publicKey,
    ...(typeof value.name === 'string' ? {name: value.name} : {}),
    ...(fee !== undefined ? {fee} : {}),
    ...(stakedSum !== undefined ? {stakedSum: String(stakedSum)} : {}),
    ...(typeof value.image === 'string' || typeof value.imgurl === 'string'
      ? {image: (value.image ?? value.imgurl) as string}
      : {}),
    ...(typeof value.website === 'string' ? {website: value.website} : {}),
    ...(typeof value.priority === 'string' || typeof value.priority === 'number'
      ? {priority: String(value.priority)}
      : {}),
  };
};

export const getValidators = async (
  apiUrl: string,
  offset: number,
  limit: number,
): Promise<ValidatorsResponse> => {
  const data = await request<{total?: unknown; validators?: unknown} | unknown[]>(apiUrl, {
    method: 'GET',
    url: `/v1/validators?offset=${offset}&limit=${limit}`,
  });
  const entries = Array.isArray(data) ? data : isRecord(data) ? data.validators : null;
  const total = Array.isArray(data) ? data.length : isRecord(data) ? data.total : null;
  if (!Array.isArray(entries) || typeof total !== 'number' || !Number.isInteger(total) || total < 0) {
    throw invalidValidators();
  }
  const validators = entries.map(normalizeValidator);
  if (validators.some(validator => validator === null)) throw invalidValidators();
  return {total, validators: validators as IValidatorData[]};
};
