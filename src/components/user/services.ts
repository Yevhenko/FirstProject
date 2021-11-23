import { createQueryBuilder, getManager, getRepository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { env } from '@config/config';
import { User } from './models/User';

import { IUser } from './interfaces';

export const createUser = async (data: IUser): Promise<IUser> => {
  const entityManager = getManager();
  await entityManager.query(`INSERT INTO "user" ("login", "password") VALUES ('${data.login}', '${data.password}')`);

  return entityManager.query(`SELECT * FROM "user" WHERE "login" = '${data.login}'`);
};

export const getUserByLogin = async (login: string): Promise<IUser[] | null> => {
  const entityManager = getManager();
  const user = await entityManager.query(`SELECT * FROM "user" WHERE "login" = '${login}'`);
  if (!user) return null;
  return user;
};

export const getUsersFromDb = async (offset: number, limit: number): Promise<IUser[]> => {
  const entityManager = getManager();
  return await entityManager.query(`SELECT * FROM "user" LIMIT ${limit} OFFSET ${offset}`);
};

export const getUserByIdFromDb = async (id: number | undefined): Promise<User> => {
  const userRepo = getRepository(User);
  const user = await userRepo.findOne({
    where: { id },
  });
  if (!user) throw new Error('no user');

  return user;
};

export const createHashedPassword = async (password: string): Promise<string> => await hash(password, env.SALT);

export const compareHashedPasswords = async (password: string, hashedPassword: string): Promise<boolean> =>
  await compare(password, hashedPassword);
