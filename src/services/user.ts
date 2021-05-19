import Redis from 'ioredis';
// @ts-ignore
const redis = new Redis({
  port: 6379,
  host: 'redis',
});
import {User} from "../db/entity/User";
import {IUser} from "../views";
import {getRepository} from "typeorm";

export const createUser = async (data: IUser): Promise<IUser> => {
        const user = getRepository(User).create(data);

        const result = await getRepository(User).save(user);

        return result;
};

export const getUserByLogin = async (login: string): Promise<IUser | null> => {
        const user = await getRepository(User).findOne({
            where: {
                login,
            },
        });

        if (!user) return null;

        return user;
};

export const getUsersFromDb = async (): Promise<IUser[]> => {
  const users = await getRepository(User).find();

  return users;
};

export const setDataToRedis = async (key: string, value: string) => {
  const data = await redis.set(key, value);

  return data;
};

export const getDataFromRedis = async (key: string) => {
  const data = await redis.get(key);

  return data;
};
