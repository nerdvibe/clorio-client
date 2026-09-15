import {request} from './http';
import {ApiError} from './types';
import type {
  IMempoolQueryData,
  IMempoolQueryResult,
  ITransactionQueryData,
  ITransactionQueryResult,
} from '../components/transactionsTable/TransactionsTypes';

interface TransactionsResponse {
  total?: unknown;
  transactions?: unknown;
}

interface MempoolResponse {
  mempool?: unknown;
}

export interface BroadcastResponse {
  hash?: string;
  id?: string;
}

const invalidTransactions = (): ApiError =>
  new ApiError('INVALID_RESPONSE', 'API returned invalid transactions data');

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object';

const asString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() !== '' ? value : null;

const asAmount = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim() !== '') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
};

const publicKeyFrom = (value: unknown): string | null => {
  if (typeof value === 'string') return value;
  return isRecord(value) ? asString(value.publicKey) : null;
};

const normalizeTransaction = (value: unknown): ITransactionQueryData | null => {
  if (!isRecord(value)) return null;
  const hash = asString(value.hash ?? value.txHash ?? value.id);
  const amount = asAmount(value.amount ?? value.value ?? value.total);
  const fee = asAmount(value.fee ?? value.networkFee);
  const sender = publicKeyFrom(value.sender_public_key ?? value.source ?? value.sender);
  const receiver = publicKeyFrom(value.receiver_public_key ?? value.receiver);
  if (!hash || !amount || !fee || !sender || !receiver) return null;
  const commandType = asString(value.command_type ?? value.commandType ?? value.type) || 'payment';
  return {
    type: commandType,
    sender_public_key: sender,
    receiver_public_key: receiver,
    fee,
    memo: typeof value.memo === 'string' ? value.memo : '',
    amount,
    hash,
    timestamp: String(value.timestamp ?? value.dateTime ?? value.date ?? ''),
    status: asString(value.status) || 'applied',
    command_type: commandType,
    failure_reason: typeof value.failure_reason === 'string'
      ? value.failure_reason
      : typeof value.failureReason === 'string' ? value.failureReason : '',
  };
};

const normalizeMempool = (value: unknown): IMempoolQueryData | null => {
  if (!isRecord(value)) return null;
  const id = asString(value.id ?? value.hash);
  const amount = asAmount(value.amount ?? value.value);
  const fee = asAmount(value.fee ?? value.networkFee);
  const source = publicKeyFrom(value.source ?? value.sender ?? value.from);
  const receiver = publicKeyFrom(value.receiver ?? value.to);
  if (!id || !amount || !fee || !source || !receiver) return null;
  return {
    id,
    amount,
    fee,
    memo: typeof value.memo === 'string' ? value.memo : '',
    kind: asString(value.kind ?? value.type ?? value.commandType) || 'PAYMENT',
    source: {publicKey: source},
    receiver: {publicKey: receiver},
  };
};

const normalizeBroadcastResponse = (value: unknown): BroadcastResponse => {
  if (!isRecord(value)) throw new ApiError('INVALID_RESPONSE', 'API returned invalid broadcast data');
  if (value.hash !== undefined && typeof value.hash !== 'string') {
    throw new ApiError('INVALID_RESPONSE', 'API returned invalid broadcast data');
  }
  if (value.id !== undefined && typeof value.id !== 'string') {
    throw new ApiError('INVALID_RESPONSE', 'API returned invalid broadcast data');
  }
  return {hash: value.hash, id: value.id};
};

const encodePublicKey = (publicKey: string): string => {
  if (typeof publicKey !== 'string' || publicKey.trim() === '') {
    throw new TypeError('Public key is required');
  }
  return encodeURIComponent(publicKey);
};

export const getTransactions = async (
  apiUrl: string,
  publicKey: string,
  offset: number,
  limit: number,
): Promise<ITransactionQueryResult> => {
  const data = await request<TransactionsResponse>(apiUrl, {
    method: 'GET',
    url: `/v1/mina/transactions/${encodePublicKey(publicKey)}?offset=${offset}&limit=${limit}`,
  });
  if (
    !isRecord(data) ||
    typeof data.total !== 'number' ||
    !Number.isInteger(data.total) ||
    data.total < 0 ||
    !Array.isArray(data.transactions)
  ) {
    throw invalidTransactions();
  }
  const transactions = data.transactions.map(normalizeTransaction);
  if (transactions.some(transaction => transaction === null)) {
    throw invalidTransactions();
  }
  return {total: data.total, transactions: transactions as ITransactionQueryData[]};
};

export const broadcastPayment = async (
  apiUrl: string,
  input: unknown,
  signature: unknown,
): Promise<BroadcastResponse> => {
  const data = await request<unknown>(apiUrl, {
    method: 'POST',
    url: '/v1/mina/transaction',
    data: {input, signature},
  });
  return normalizeBroadcastResponse(data);
};

export const broadcastDelegation = async (
  apiUrl: string,
  input: unknown,
  signature: unknown,
): Promise<BroadcastResponse> => {
  const data = await request<unknown>(apiUrl, {
    method: 'POST',
    url: '/v1/mina/transaction/delegation',
    data: {input, signature},
  });
  return normalizeBroadcastResponse(data);
};

export const getMempool = async (
  apiUrl: string,
  publicKey: string,
): Promise<IMempoolQueryResult> => {
  const data = await request<MempoolResponse | unknown[]>(apiUrl, {
    method: 'GET',
    url: `/v1/mina/mempool/${encodePublicKey(publicKey)}`,
  });
  const entries = Array.isArray(data) ? data : isRecord(data) ? data.mempool : null;
  if (!Array.isArray(entries)) throw invalidTransactions();
  const mempool = entries.map(normalizeMempool);
  if (mempool.some(transaction => transaction === null)) {
    throw invalidTransactions();
  }
  return {mempool: mempool as IMempoolQueryData[]};
};
