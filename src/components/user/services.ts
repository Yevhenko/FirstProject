import { getRepository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { User } from './models/User';
import { IUser } from './interfaces';
import { env } from '../../config/config';

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

export const getUsersFromDb = async (skip: number, perPage: number): Promise<IUser[]> => {
  const users = await getRepository(User).createQueryBuilder('user').skip(skip).take(perPage).getMany();

  return users.map((u) => ({ id: u.id, login: u.login }));
};

export const createHashedPassword = async (password: string): Promise<string> => {
  return await hash(password, env.SALT);
};

export const compareHashedPasswords = async (
  password: string,
  hashedPassword: string | undefined,
): Promise<boolean | null> => {
  if (!hashedPassword) return null;
  return await compare(password, hashedPassword);
};
