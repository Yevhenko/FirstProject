import { redisClient } from '@config/config';
import { setDataToRedis } from '@components/auth/services';

const mocks = { redis: null };
jest.mock('ioredis', () => {
  const Redis = require('ioredis-mock');

  if (typeof Redis === 'object') {
    return {
      Command: { _transformer: { argument: {}, reply: {} } },
    };
  }

  return function (...args: any) {
    const instance = new Redis(args);
    mocks.redis = instance;
    return instance;
  };
});

jest.mock('ioredis', () => require('ioredis-mock/jest'));

describe.skip('testing authServices', () => {
  const key = 'key';
  const value = 'value';

  it('redis set', async () => {
    const redisMoc = mocks.redis as jest.MockedFunction<any>;
    redisMoc.mockResolvedValue('OK');

    await setDataToRedis(key, value);
    expect(redisMoc.set).toHaveBeenCalledWith(key, value);
  });
});
