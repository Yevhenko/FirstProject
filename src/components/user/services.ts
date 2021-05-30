import { getRepository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { User } from './models/User';
import { IUser } from './interfaces';
import { env } from '../../config/config';

export const createUser = async (data: IUser): Promise<IUser> => {
  const userRepo = getRepository(User);
  const user = await userRepo.create(data);

  return await userRepo.save(user);
};

export const getUserByLogin = async (login: string): Promise<IUser | undefined> =>
  await getRepository(User).findOne({ where: { login } });

export const getUsersFromDb = async (offset: number, limit: number): Promise<IUser[]> => {
  const userRepo = getRepository(User);
  const users = await userRepo.createQueryBuilder('user').skip(offset).take(limit).getMany();

  return users;
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
