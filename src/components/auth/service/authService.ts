import Redis from 'ioredis';
import { Session } from 'express-session';

const redis = new Redis({
  port: 6379,
  host: 'redis',
});

export const setDataToRedis = async (key: string, value: any): Promise<any> => {
  const data = await redis.set(key, value);

  return data;
};

export const getDataFromRedis = async (key: string) => {
  const data = await redis.get(key);

  return data;
};

export const checkTheKeyInRedis = async (key: string) => {
  const data = await redis.exists(key);

  return data;
};
