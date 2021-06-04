import { Response } from 'express';
import { ModifiedRequest } from '@constants/interfaces';
import { getUsersFromDb } from './services';

export const getAllUsers = async (req: ModifiedRequest, res: Response): Promise<Response> => {
  const {
    query: { offset, limit },
  } = req;

  const users = await getUsersFromDb(Number(offset), Number(limit));

  return res.json(users.map((u) => ({ id: u.id, login: u.login })));
};
