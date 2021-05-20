import { NextFunction, Request, Response } from 'express';
import { getUserByIdFromDb } from '../service/user';
import { getDataFromRedis } from '../../auth/service/authService';

export const saveUserToRequest = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { cookies } = req;

  const key = Object.keys(cookies)[0];

  const data = JSON.parse(<string>await getDataFromRedis(key));

  const user = await getUserByIdFromDb(data.userId);

  if (!user) return res.status(404).send('not found');

  req.user = user;
  return next();
};
