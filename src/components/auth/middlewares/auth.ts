import { NextFunction, Request, Response } from 'express';
import { checkTheKeyInRedis, getDataFromRedis } from '../service/authService';

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { cookies } = req;

  const value: any = Object.values(cookies)[0];

  const data = await checkTheKeyInRedis(value);

  if (data) {
    return next();
  }
  return res.status(404).send('login please');
};
