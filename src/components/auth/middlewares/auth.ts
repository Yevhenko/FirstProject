import { NextFunction, Request, Response } from 'express';
import { getDataFromRedis } from '../service/authService';
import { constants } from '../../../constants';
import { getUserByIdFromDb } from '../../user/service/user';
import { ModifiedRequest } from '../../user/interface';

export const auth = async (req: ModifiedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  const { cookies } = req;

  const sessionId = cookies[constants.COOKIES_KEY];

  if (!sessionId) return res.status(404).send('no propper cookie');
  const data = await getDataFromRedis(sessionId);

  if (data !== null) {
    const session = JSON.parse(data);
    const user = await getUserByIdFromDb(session.userId);

    if (!user) return res.status(500).send('user not found');

    req.user = user;
    return next();
  }
  return res.status(401).send('login please');
};
