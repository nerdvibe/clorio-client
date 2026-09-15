import {request} from './http';
import {ApiError} from './types';

export interface AccountBalance {
  total: string;
  liquid: string;
  locked: string;
  liquidUnconfirmed: string;
  unconfirmedTotal: string;
}

export interface AccountDelegate {
  publicKey: string;
  name?: string;
}

export interface AccountData {
  publicKey: string;
  nonce: number;
  pendingNonce: number;
  balance: AccountBalance;
  delegate: AccountDelegate | null;
}

export const toNonceQueryResult = (account: AccountData) => ({
  accountByKey: {usableNonce: account.pendingNonce},
});

interface AccountResponse {
  publicKey?: unknown;
  nonce?: unknown;
  balance?: unknown;
  delegate?: unknown;
}

type MempoolResponse = {mempool?: unknown} | unknown[];

interface MempoolEntry {
  source?: {publicKey?: unknown} | string;
}

const invalidAccount = (): ApiError =>
  new ApiError('INVALID_RESPONSE', 'API returned invalid account data');

const asAmount = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim() !== '') {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return null;
};

const asNonce = (value: unknown): number | null =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;

const normalizeBalance = (value: unknown): AccountBalance | null => {
  if (value !== null && typeof value !== 'object') {
    const amount = asAmount(value);
    return amount === null
      ? null
      : {
          total: amount,
          liquid: amount,
          locked: '0',
          liquidUnconfirmed: amount,
          unconfirmedTotal: amount,
        };
  }
  if (!value || typeof value !== 'object') {
    return null;
  }
  const balance = value as Record<string, unknown>;
  const amounts = {
    total: asAmount(balance.total),
    liquid: asAmount(balance.liquid),
    locked: asAmount(balance.locked),
    liquidUnconfirmed: asAmount(balance.liquidUnconfirmed),
    unconfirmedTotal: asAmount(balance.unconfirmedTotal),
  };
  return Object.values(amounts).some(amount => amount === null)
    ? null
    : (amounts as AccountBalance);
};

const normalizeDelegate = (value: unknown): AccountDelegate | null | undefined => {
  if (value === null) {
    return null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return {publicKey: value};
  }
  if (!value || typeof value !== 'object') {
    return undefined;
  }
  const delegate = value as Record<string, unknown>;
  if (typeof delegate.publicKey !== 'string' || delegate.publicKey.trim() === '') {
    return undefined;
  }
  if (delegate.name !== undefined && typeof delegate.name !== 'string') {
    return undefined;
  }
  return {
    publicKey: delegate.publicKey,
    ...(typeof delegate.name === 'string' ? {name: delegate.name} : {}),
  };
};

const countOutgoing = (value: unknown, publicKey: string): number | null => {
  const entries = Array.isArray(value)
    ? value
    : value && typeof value === 'object' && Array.isArray((value as MempoolResponse).mempool)
      ? (value as {mempool: unknown[]}).mempool
      : null;
  if (!entries) {
    return null;
  }
  return (entries as MempoolEntry[]).filter(entry => {
    const source = entry?.source;
    if (typeof source === 'string') return source === publicKey;
    return source?.publicKey === publicKey;
  }).length;
};

export const getAccount = async (apiUrl: string, publicKey: string): Promise<AccountData> => {
  if (typeof publicKey !== 'string' || publicKey.trim() === '') {
    throw new TypeError('Public key is required');
  }

  const encodedPublicKey = encodeURIComponent(publicKey);
  const [account, mempool] = await Promise.all([
    request<AccountResponse>(apiUrl, {
      method: 'GET',
      url: `/v1/mina/accounts/${encodedPublicKey}`,
    }),
    request<MempoolResponse>(apiUrl, {
      method: 'GET',
      url: `/v1/mina/mempool/${encodedPublicKey}`,
    }).catch(() => []),
  ]);

  if (!account || typeof account !== 'object') {
    throw invalidAccount();
  }
  const nonce = asNonce(account.nonce);
  const balance = normalizeBalance(account.balance);
  const delegate = normalizeDelegate(account.delegate);
  const outgoingCount = countOutgoing(mempool, publicKey);
  if (
    account.publicKey !== undefined &&
    (typeof account.publicKey !== 'string' || account.publicKey.trim() === '') ||
    nonce === null ||
    balance === null ||
    delegate === undefined ||
    outgoingCount === null
  ) {
    throw invalidAccount();
  }

  return {
    publicKey: typeof account.publicKey === 'string' ? account.publicKey : publicKey,
    nonce,
    pendingNonce: nonce + outgoingCount,
    balance,
    delegate,
  };
};
