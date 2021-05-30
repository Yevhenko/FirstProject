import { Response } from 'express';
import { ModifiedRequest } from '../../constants/interface';
import { getUsersFromDb } from './services';
import * as service from '../post/service';

export const getAllUsers = async (req: ModifiedRequest, res: Response): Promise<Response> => {
  const {
    query: { offset, limit },
  } = req;

  const users = await getUsersFromDb(Number(offset ?? 0), Number(limit ?? 10));

  return res.json(users.map((u) => ({ id: u.id, login: u.login })));
};
