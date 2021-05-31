import { NextFunction, Response } from 'express';
import { getDataFromRedis } from './services';
import { constants } from '../../constants/constatnts';
import { userService } from '@components/user';
import { ModifiedRequest } from '../../constants/interface';

export const auth = async (req: ModifiedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  const { cookies } = req;

  const sessionId = cookies[constants.COOKIES_KEY];

  if (!sessionId) return res.status(404).send('no proper cookie');
  const data = await getDataFromRedis(sessionId);

  if (data !== null) {
    const session = JSON.parse(data);
    const user = await userService.getUserByIdFromDb(session.userId);

    if (!user) return res.status(500).send('user not found');

    req.user = user;
    return next();
  }
  return res.status(401).send('invalid sign-in');
};
