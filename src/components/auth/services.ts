import { redisClient as redis } from '@config/config';

export const setDataToRedis = async (key: string, value: any): Promise<string | null> => await redis.set(key, value);
export const getDataFromRedis = async (key: string): Promise<string | null> => await redis.get(key);
