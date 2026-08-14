export type ApiErrorCode =
  'CANCELLED' | 'HTTP_ERROR' | 'INVALID_RESPONSE' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;

  constructor(code: ApiErrorCode, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}
