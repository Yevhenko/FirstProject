import { Request, Response } from 'express';
import { getUsersFromDb } from './services';

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  const {
    query: { offset, limit },
  } = req;

  const users = await getUsersFromDb(Number(offset), Number(limit));

  return res.json(users.map((u) => ({ id: u.id, login: u.login })));
};
