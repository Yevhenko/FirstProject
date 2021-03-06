import { NextFunction, Request, Response } from 'express';
import { getDataFromRedis } from '../service/authService';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const { cookies } = req;
  const key: any = Object.values(cookies)[0];

  const data = await getDataFromRedis(key);

  if (data === key) {
    return next();
  }
  return res.status(404).send('login please');
};
