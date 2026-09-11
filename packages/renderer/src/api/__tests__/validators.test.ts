import {beforeEach, describe, expect, it, vi} from 'vitest';
import {ApiError} from '../types';
import {getValidators} from '../validators';

const mockedRequest = vi.hoisted(() => vi.fn());
vi.mock('../http', () => ({request: mockedRequest}));

describe('getValidators', () => {
  beforeEach(() => mockedRequest.mockReset());

  it('loads validators and total in one response', async () => {
    mockedRequest.mockResolvedValue({
      total: 1,
      validators: [{publicKey: 'B62q', name: 'Validator', fee: 2}],
    });

    await expect(getValidators('https://api.example.com/v1', 20, 20)).resolves.toEqual({
      total: 1,
      validators: [{publicKey: 'B62q', name: 'Validator', fee: 2}],
    });
    expect(mockedRequest).toHaveBeenCalledWith('https://api.example.com/v1', {
      method: 'GET',
      url: '/v1/validators?offset=20&limit=20',
    });
  });

  it('accepts the deployed array response and string fee fields', async () => {
    mockedRequest.mockResolvedValue([{publicKey: 'B62q', fee: '2', imgurl: 'https://image'}]);
    await expect(getValidators('https://api.example.com', 0, 20)).resolves.toEqual({
      total: 1,
      validators: [{publicKey: 'B62q', fee: 2, image: 'https://image'}],
    });
  });

  it('rejects malformed validator responses', async () => {
    mockedRequest.mockResolvedValue({total: 1, validators: [{name: 'Missing key'}]});
    await expect(getValidators('https://api.example.com', 0, 20)).rejects.toEqual(
      new ApiError('INVALID_RESPONSE', 'API returned invalid validators data'),
    );
  });
});
