import Redis from 'ioredis';

const redis = new Redis({
  port: 6379,
  host: 'redis',
});

export const setDataToRedis = async (key: string, value: any): Promise<any> => await redis.set(key, value);
export const getDataFromRedis = async (key: string) => await redis.get(key);
